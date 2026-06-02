# Auditoría de Seguridad — Proyecto ProDefi

**Rama auditada**: `small-fixes`
**Fecha**: 2026-05-28
**Alcance**: Smart contracts en `src/` (`Carton.sol`, `Treasury.sol`, `Predictions.sol`, `PredictionsFactory.sol`)

---

## Resumen ejecutivo

El sistema se compone de cuatro contratos: `Carton` (ERC1155 vendedor de "cartones"), `Treasury` (custodia multi-asset de pools de premios), `Predictions` (motor de juego/scoring por torneo) y `PredictionsFactory` (dead code, no usado en `Deploy.s.sol`). El diseño hereda buenas piezas de OpenZeppelin (AccessControl, SafeERC20, ReentrancyGuard, ERC1155Pausable) y separa razonablemente las responsabilidades, pero presenta varias debilidades de severidad alta y media: contabilidad ERC20/ETH desacoplada de saldos reales con riesgo de DoS por tokens fee-on-transfer/rebasing y varios puntos donde el owner puede atascar el torneo (DoS por centralización). La inconsistencia grave de `userTokens` por ownership parcial fue mitigada al forzar `amount == 1` por cartón, el índice `userTokens` ahora usa remove O(1), los ganadores oficiales ahora pueden corregirse antes de publicar el leaderboard final, la deadline de submission ya no puede reabrirse después de expirar o una vez que el torneo avanzó de fase, y el flujo de sellado/fondeo final del `Treasury` ahora evita sembrar reservas después del seal y exige que el engine del torneo ya esté listo antes de sellar premios. No se encontró ninguna vulnerabilidad crítica explotable de robo directo de fondos por un actor no privilegiado.

| Severidad | Cantidad |
|-----------|----------|
| Critical  | 0        |
| High      | 2        |
| Medium    | 5        |
| Low       | 9        |
| Informational | 8    |

---

## 1. Contratos en `src/` y descripción breve

- `src/Carton.sol` — ERC1155 con roles (`URI_SETTER`, `PAUSER`, `MINTER`). Acepta sólo ERC20 listados (ETH deshabilitado: `buyCarton()` siempre revierte). Cada token ID es único (no fungible en la práctica: amount=1) y se vincula a un `tournamentId`. Reenvía ingresos al `Treasury` vía `depositFromSalesERC20`.
- `src/Treasury.sol` — Custodia multi-activo y multi-torneo. Gestiona pools (`prizePools`), reserva global (`globalReserve`), distribución por posición (`prizePoolDistributions`), montos finales por tokenId (`finalPrizeAmounts`) y los snapshots / cierre del torneo. Los usuarios reclaman con `claimPrize`.
- `src/Predictions.sol` — Motor de predicciones por torneo. Cada `tokenId` envía una vez `Prediction[]` y opcionalmente sus 4 equipos ganadores. El owner setea resultados oficiales, calcula puntos off-chain y carga el leaderboard (`setPositions` o flujo batched `beginPositionsUpdate` → `appendPositionsBatch` → `finalizePositionsUpdate`). Treasury sólo finaliza cuando `isReadyForFinalization()` retorna `true`.
- `src/PredictionsFactory.sol` — Factoría para desplegar `Predictions` por torneo. Dead code: no se invoca desde `Deploy.s.sol` y la suite de tests no la cubre. Permanece desplegable pero no es ruteo crítico.

---

## 2. Hallazgos ordenados por severidad

---

### [HIGH] H-1 — Reentrancy en `Treasury.claimPrize` (sin `nonReentrant`) con riesgo de cross-function reentrancy

- **Estado**: RESUELTO — `Treasury` ahora hereda `ReentrancyGuard`, `claimPrize` usa `nonReentrant` y se agregó test de reentrancy ETH (`test_ClaimPrize_BlocksEthReentrancy`).
- **Contrato**: `src/Treasury.sol:180` (función `claimPrize`)
- **Impacto**: Vector de reentrancy cross-function. Un ganador puede potencialmente re-entrar a otras funciones públicas del Treasury durante el callback ETH. Hoy el estado clave (`claimed[...]`) se setea antes de la llamada externa, así que la reentrancy a la misma `claimPrize(tournamentId, tokenId, token)` está bloqueada por el flag `claimed`. Sin embargo, el contrato no extiende `ReentrancyGuard` y se realizan `.call{value:...}` y `safeTransfer` a una dirección controlada por el atacante. Si en el futuro se agrega cualquier función de "withdraw"/"merge"/"sweep"/"reserve manipulation" que toque mappings compartidos, queda expuesto.
- **Descripción**: Hay un patrón check-effects-interactions correcto en `claimPrize`, pero ETH transfers a contratos atacantes son atómicamente reentrantes. Combinado con el hecho de que `cartonContract.balanceOf(msg.sender, tokenId)` se chequea antes del `.call`, un atacante con un contrato fallback malicioso podría, en el mismo callstack: (a) transferir el ERC1155 a otra wallet controlada, (b) llamar `claimPrize` con OTRA `tokenId` del mismo set ganador. Esto NO genera doble cobro porque cada `(tournamentId, tokenId, token)` tiene su propio flag `claimed`, pero la falta de `nonReentrant` es una bomba de tiempo para cualquier extensión futura.
- **Recomendación**: Hacer que `Treasury` extienda `ReentrancyGuard` y marcar `claimPrize` (y cualquier función que mueva fondos) con `nonReentrant`. Igualmente para `seedTournamentFromReserve` por consistencia.
- **Evaluación GPT**: Confirmado como riesgo defensivo real, aunque ajustaría la severidad a **Medium** en el código actual porque `claimed[...]` se escribe antes de la llamada externa y no identifiqué doble cobro directo. Mantendría el fix igualmente porque es barato y reduce riesgo futuro.

---

### [HIGH] H-2 — La contabilidad de `prizePools` puede divergir del balance real con tokens fee-on-transfer / rebasing

- **Estado**: DESESTIMADO — El protocolo sólo soportará ERC20 estándar sin fee-on-transfer ni rebasing. Se dejó una nota explícita en `depositFromSalesERC20`; no se implementa soporte para este tipo de tokens. - se agregó allow list con chequeo para eviar agregar ese tipo de tokens.
- **Contrato**: `src/Treasury.sol:151-167` (`depositFromSalesERC20`) y `src/Carton.sol:149` (`safeTransferFrom`)
- **Impacto**: Para cualquier ERC20 con tasa-on-transfer (USDT en algunas chains, PAXG, SAFEMOON, fork tokens), el `amount` declarado entra contablemente pero el Treasury recibe menos. Resultado: cuando los ganadores intenten reclamar, el último claim revertirá por falta de balance, generando DoS de pagos para una porción de los ganadores y bloqueando dinero.
- **Descripción**: El flujo registra `amount` como ingreso sin medir delta de balance pre/post. Si bien el deploy actual sólo whitelistea USDC en mainnet (que no tiene fee-on-transfer), `Carton.setAcceptedToken` permite al admin habilitar cualquier ERC20 después, y `Treasury` confía en el amount declarado.
- **Recomendación**: Medir delta: `pre = balanceOf(this); transferFrom(...); post = balanceOf(this); credited = post - pre;` y usar `credited` para acumular `prizePools` y `globalReserve`. Alternativamente, documentar y enforce que sólo se acepten tokens "standard" auditados (denylist explícita para rebasing/fee-on-transfer en setAcceptedToken).
- **Evaluación GPT**: Confirmado. Para el deploy actual con MockUSDC/USDC estándar el riesgo práctico es bajo, pero como `setAcceptedToken` deja habilitar cualquier ERC20, la vulnerabilidad existe a nivel de diseño. Severidad **High** si el set de tokens queda abierto; **Low/Medium** si se limita operacionalmente a USDC auditado.

---

### [HIGH] H-3 — `Carton.userTokens` queda desincronizado tras `burn` y posibles transferencias batch (lógica defectuosa)

- **Estado**: RESUELTO — `Carton` ahora fuerza `amount == 1` en `mint`, `mintForTournament` y `mintBatchForTournament`, preservando la premisa de "un cartón = un tokenId único" y eliminando los casos de ownership parcial que desincronizaban `userTokens`. El costo O(N) residual del índice auxiliar permanece cubierto por `M-1`.

- **Contrato**: `src/Carton.sol:224-237`, `241-265`
- **Impacto**: El mapping `userTokens` se vuelve incoherente. Los frontends que confíen en `getUserTokens(user)` mostrarán datos incorrectos: tokens que el usuario ya no posee (si no se borran) o ausencia de tokens que sí posee. No causa pérdida de fondos directa, pero sí mala UX y posibles errores de claim si el front guía al usuario con esta lista. Más preocupante: en `_update`, el bucle de remove/add usa `tokens` cacheado en memoria, así que cuando llegan tokens repetidos en el mismo batch (poco probable porque cada tokenId es único) o ediciones simultáneas, el resultado divergiría.
- **Descripción**: El hook `_update` cubre mint, burn y transfer. Sin embargo, en el branch `to == address(0)` (burn), se elimina del array del `from` pero NO se chequea si efectivamente el balance llegó a cero. Como ERC1155 supports `value` > 1 pero el contrato usa value=1 por id en `_mint(... 1 ...)` durante compra (ver línea 153), eso atenúa el problema, pero `mintForTournament` y `mintBatchForTournament` aceptan `amount` arbitrario del MINTER. Si MINTER mintea 5 del tokenId X y el user transfiere 2 a otra wallet, ambos quedan con balance > 0 pero el array sólo tiene la entrada en uno de los dos. Cuando burnean parcialmente, el array no detecta `balance > 0 todavía`. Adicionalmente `_removeTokenFromUser` linealmente recorre y hace swap-pop: con cientos de cartones por user, los hooks de transferencia cuestan O(N) gas — vector de DoS en transfers batch (ver M-1).
- **Recomendación**: (a) Cambiar el modelo: usar EnumerableSet por user y sólo agregar al primer balance > 0 y remover cuando balance llega a 0. (b) Alternativamente, eliminar `userTokens` del contrato y resolverlo off-chain con indexer (recomendable porque las cuentas on-chain de ownership son redundantes con los eventos ERC1155).
- **Evaluación GPT**: Confirmado y además lo considero ligado a un problema más grave: `mintForTournament` permite `amount > 1`, lo que rompe la premisa de carton único por `tokenId`. Si se fuerza `amount == 1`, baja bastante el impacto de inconsistencia parcial, aunque el problema de arrays O(N) sigue.

---

### [HIGH] H-4 — `setOfficialWinners` no se puede corregir (centralización dura + soft brick si hay error humano)

- **Estado**: RESUELTO — `Predictions` ahora expone `updateOfficialWinners(uint8[4])`, con la misma validación que el set inicial, bloqueado si el torneo ya fue finalizado o si el leaderboard final ya fue publicado / está en actualización. Se agregó `OfficialWinnersUpdated` y cobertura de tests para corrección válida y reverts de locking.

- **Contrato**: `src/Predictions.sol:577-592`
- **Impacto**: Si el owner publica equipos ganadores incorrectos (typo, índice mal, equipos invertidos), no existe función de update. Como `isReadyForFinalization()` chequea `officialWinners.set`, el torneo igualmente puede finalizarse, pero los puntos `calculateWinnerPoints` quedan calculados con datos erróneos. Los usuarios pierden hasta 63 puntos potenciales (25+18+10+10). Y peor: si el owner detecta el error después de haber cargado el leaderboard, los cartones ganadores reales no van a aparecer arriba. Combinado con `setPositions` (que es off-chain calculado), un owner deshonesto/comprometido podría sesgar el ranking final permanentemente.
- **Descripción**: La línea 578 incluso menciona en comentario el problema: "what if theres some error? .. proably need to add some edition capability". Para resultados de partidos sí hay `updateResults`, pero para ganadores oficiales no. Esta asimetría es probablemente un olvido.
- **Recomendación**: Agregar `updateOfficialWinners(uint8[4])` (`onlyOwner`) con la misma validación, sólo permitido antes de que Treasury finalice el torneo (mismo guard que `_revertIfTournamentClosedForCorrections`). Idealmente con un evento que distinga update vs set inicial.
- **Evaluación GPT**: Confirmado. Lo mantendría como **High** por impacto de integridad competitiva, aunque no es robo directo. La corrección debe invalidar posiciones/premios ya publicados si los ganadores se cambian después del cálculo.

---

### [MEDIUM] M-1 — `_update` recorre arrays sin bound en transferencias ERC1155 batch — DoS por gas

- **Estado**: RESUELTO — `Carton` mantiene `userTokens` con un índice auxiliar `userTokenIndexPlusOne`, por lo que `_addTokenToUser` y `_removeTokenFromUser` pasan a ser O(1) con `swap + pop`, eliminando el patrón O(K*N) en transfers batch.

- **Contrato**: `src/Carton.sol:228-237, 241-265`
- **Impacto**: `_removeTokenFromUser` es O(N) por token movido. En una transferencia batch con K tokens donde el remitente tiene N tokens, el coste es O(K·N). Un user con muchos cartones (>500) que reciba/envíe batches grandes puede llevar la transacción por encima del block gas limit, atrapando los tokens.
- **Descripción**: ERC1155 fue diseñado para muchas IDs por user. Acá el modelo de "1 tokenId único por compra" inflará el array `userTokens[user]` indefinidamente.
- **Recomendación**: Ver H-3. Cambiar a EnumerableSet (O(1) remove) o quitar el seguimiento on-chain.
- **Evaluación GPT**: Confirmado. El riesgo depende del número de cartones por wallet, pero el patrón O(K*N) en hooks ERC1155 es una fuente clara de DoS por gas. Preferiría eliminar `userTokens` onchain y usar eventos/indexer.

---

### [MEDIUM] M-2 — Submission deadline puede atrasarse arbitrariamente y "abrir" la ventana después de cerrar

- **Estado**: RESUELTO — `Predictions.setSubmissionDeadline` ahora revierte con `SubmissionDeadlineLocked()` si ya expiró la deadline vigente, si ya hubo submissions, si Treasury marca ventas cerradas o si existe al menos un resultado oficial cargado. Se agregaron tests para cada condición de lock.

- **Contrato**: `src/Predictions.sol:186-190`, `450-477`
- **Impacto**: El owner puede llamar `setSubmissionDeadline` después de que la deadline anterior expirara, mientras no haya restricción de "una vez vencida no se puede mover". Esto permite re-abrir el envío de predicciones para tokens nuevos, dándole a usuarios con info posterior una ventaja injusta (front-running de outcomes ya conocidos). Combinado con el hecho de que `setResults` requiere que las ventas estén cerradas pero NO chequea deadline, el owner podría: (1) cerrar ventas, (2) ver resultados parciales, (3) extender deadline, (4) mintear/asignar cartones a una cuenta propia y enviar predicciones "perfectas".
- **Descripción**: La función sólo valida `_deadline > block.timestamp`. No hay flag de "frozen" ni guard de "no se puede modificar si ya empezó a haber resultados oficiales".
- **Recomendación**: Bloquear `setSubmissionDeadline` cuando (a) ya pasó la deadline original, o (b) cualquier `games[i].set == true`, o (c) `predictionsStarted == true` (al menos no se puede REDUCIR si ya hay submits, y no se puede AUMENTAR si ya hubo resultados). Un patrón sano: permitir extender sólo hasta un máximo absoluto fijado al constructor, y bloquear cualquier movimiento una vez seteado el primer resultado.
- **Evaluación GPT**: Confirmado. Yo lo elevaría en prioridad operativa porque permite manipular fairness del torneo sin tocar fondos directamente. La regla mínima debería ser: no cambiar deadline después de ventas cerradas o después del primer resultado.

---

### [MEDIUM] M-3 — `setPositions` (legacy) y `appendPositionsBatch` permiten arbitrar el ranking sin verificación on-chain

- **Estado**: PARCIALMENTE MITIGADO / ACLARADO — el flujo operativo actual ya no usa `setPositions` como camino normal. `Predictions` lo documenta explícitamente como fallback legacy, y el admin publica posiciones con el flujo batched (`beginPositionsUpdate` → `appendPositionsBatch` → `finalizePositionsUpdate`) usando por defecto los `calculateTotalPoints(tokenId)` on-chain; el CSV manual quedó relegado a override de emergencia. Además, el fallback `setPositions(...)` ya no acepta tokens no elegibles ni duplicados, el pipeline competitivo ahora queda anclado a `competitionStateRevision`, y `Treasury.setFinalPrizeAmounts(...)` sólo acepta premios `> 0` para tokens que pertenezcan al leaderboard vigente. El riesgo residual sigue siendo de centralización: el contrato aún no verifica on-chain que los puntos declarados en cada batch coincidan con `calculateTotalPoints`, aunque ya no alcanza con cargar premios para un token arbitrario fuera del ranking actual.
- **Contrato**: `src/Predictions.sol:207-238, 259-309`
- **Impacto**: El ranking final y los payouts siguen dependiendo de un operador confiable. `appendPositionsBatch` valida elegibilidad del token, torneo, duplicados y completitud del draft, pero NO compara `pointValue` contra `calculateTotalPoints(tokenId)` on-chain. Por eso un owner deshonesto todavía podría reordenar cartones válidos mintiendo los puntos. El problema principal es de integridad administrativa, no de exploit por un tercero sin privilegios.
- **Descripción**: El TODO en `Predictions` ya reconoce que faltan garantías de integridad del leaderboard. El flujo actual reduce bastante el riesgo operativo respecto del legacy one-shot porque el admin usa puntos on-chain por defecto y el batch valida membresía/completitud, pero la fuente de verdad final del ranking y de `finalPrizeAmounts` sigue siendo una publicación administrativa.
- **Recomendación**: Mantener como política el flujo batched + on-chain-first en admin, y si más adelante quieren endurecer sin cambiar el modelo de gas: (1) deshabilitar definitivamente `setPositions` en contrato cuando ya no haga falta el fallback; (2) publicar un `leaderboardHash` / commitment con ventana de challenge; o (3) en una fase posterior, validar `calculateTotalPoints(tokenId) == pointValue` por batch con tamaño más chico. Para operación productiva, mover ownership a un multisig / timelock sigue siendo la mitigación práctica más barata.
- **Evaluación GPT**: Parcialmente confirmado. Los dos huecos operativos más peligrosos ya quedaron cubiertos: `setPositions` legacy ya valida elegibilidad/duplicados y la publicación de posiciones/premios ahora queda invalidada automáticamente cuando cambia la revisión competitiva. El riesgo remanente es más "admin-operated / no trustless" que una vulnerabilidad técnica explotable por usuarios, porque los puntos publicados siguen sin verificarse on-chain.

---

### [MEDIUM] M-4 — `Treasury.finalizeTournament` recorre `prizeDistributionTokens` sin bound y revierte si un pool quedó vacío

- **Estado**: RESUELTO — `Treasury.finalizeTournament` ahora saltea assets configurados pero vacíos cuando `pool == 0` y `finalPrizeAmountTotals == 0`, manteniendo `NoPrizePool` si no existe ningún asset real para cerrar. Además se agregó `removePrizeDistributionToken(tournamentId, token)` para que el admin pueda des-registrar un asset configurado por error antes de finalizar, sólo si sigue vacío, sin montos finales cargados y sin sello. Tests agregados: `test_FinalizeTournament_IgnoresConfiguredEmptyAsset`, `test_RemovePrizeDistributionToken_Success`, `test_RemovePrizeDistributionToken_RevertWhenPoolHasFunds` y `test_RemovePrizeDistributionToken_OnlyAdminRole`.
- **Contrato**: `src/Treasury.sol`
- **Impacto original**: Si el admin llamaba `setPrizeDistribution(tournamentId, tokenX, ...)` para un token donde después no entraba ninguna venta (`pool == 0`), `finalizeTournament` revertía siempre por `NoPrizePool`. Resultado: torneo no finalizable hasta agregar fondos manualmente o tocar storage vía nuevo código.
- **Descripción**: El riesgo provenía de combinar una lista append-only (`prizeDistributionTokens`) con el requisito de sellar/cerrar todos los assets configurados, incluso aquellos que quedaron vacíos por error operativo.
- **Fix aplicado**: Se cubrieron las dos mitigaciones recomendadas: skip explícito para assets vacíos/no usados en `finalizeTournament`, y remoción administrativa segura mediante `PrizeDistributionRemoved` + `removePrizeDistributionToken(...)`.
- **Evaluación GPT**: Confirmado y ya mitigado sin aflojar las validaciones de assets con fondos o premios cargados.

---

### [MEDIUM] M-5 — `seedTournamentFromReserve` no actualiza `closedPrizePools` ni interactúa correctamente con el flujo de sellado

- **Estado**: RESUELTO — `Treasury.seedTournamentFromReserve` ahora revierte si `finalPrizeAmountsReady[tournamentId][token]` ya está sellado, y `sealFinalPrizeAmounts` además exige que el engine registrado para ese torneo esté `ready` antes de congelar los montos. Se agregaron tests para ambos guards.

- **Contrato**: `src/Treasury.sol:289-306`, `363-376`
- **Impacto**: Si el admin sembró el pool desde reserva DESPUÉS de haber sellado los amounts finales (`finalPrizeAmountsReady[token] = true`), el `prizePools[tournamentId][token]` aumentaría pero `finalPrizeAmountTotals` queda igual y al finalizar (línea 373) `closedPrizePools` toma el valor inflado. Como `getUserPrizeAmount` para tournament finalizado usa `closedPrizePools` * percentage / 100, la view function devolvería un monto distinto al que realmente recibirán los usuarios (los users reciben `finalPrizeAmounts`, no porcentajes). Inconsistencia entre vistas y realidad; potencial confusión y reportes erróneos.
- **Descripción**: No hay revert si se llama post-sello, lo cual abre una vía para inflar artificialmente la vista del prize pool sin afectar pagos.
- **Recomendación**: Revertir `seedTournamentFromReserve` si `finalPrizeAmountsReady[token] == true` (o agregar lógica para reabrir el sello). Alternativamente, deprecar `getUserPrizeAmount` para tournament finalizado y exponer únicamente `finalPrizeAmounts`.
- **Evaluación GPT**: Confirmado. El principal daño es inconsistencia UI/accounting, no pérdida directa. La corrección más limpia es bloquear `seedTournamentFromReserve` cuando `finalPrizeAmountsReady[tournamentId][token]` ya está sellado.

---

### [MEDIUM] M-6 — Owner del `Predictions` no se valida en el constructor; deploy con address(0) → contrato inutilizable

- **Estado**: SKIPPED / SIN ACCION — no se implementa fix porque el riesgo real no está en `Predictions.sol`, sino en `PredictionsFactory`, y esa factory ya fue archivada fuera de `src/` por ser dead code y no formar parte del flujo de deploy vigente.
- **Contrato**: `src/Predictions.sol:165-169` y referencia histórica en `docs/archive/contracts/PredictionsFactory.sol`
- **Impacto**: El constructor usa `Ownable(msg.sender)`, lo cual es válido en deploy directo. El problema aparecía solamente si una factory desplegaba `Predictions` y luego no transfería ownership al owner operativo. En la factory archivada, `createTournament` aceptaba `owner == address(0)` y dejaba a la propia factory como owner permanente, sin funciones para invocar los setters `onlyOwner`, volviendo esa instancia inutilizable.
- **Por qué se saltea**: el deploy activo usa `new Predictions(...)` directo desde `script/Deploy.s.sol`, no existe consumo productivo de la factory, y `PredictionsFactory.sol` ya no compila ni integra el set de contratos activos. En este estado, tocar `Predictions.sol` no mitiga un riesgo real del sistema en uso.
- **Recomendación**: Si en el futuro vuelve una factory a producción, exigir `owner != address(0)` y transferir ownership siempre en la factory. No hace falta cambiar `Predictions` sólo por este hallazgo.
- **Evaluación GPT**: Confirmado como problema de la factory, no del constructor de `Predictions`. La decisión correcta hoy es documentarlo y cerrarlo como no aplicable al flujo actual.

---

### [MEDIUM] M-7 — `setResults` no exige que la deadline haya pasado; el owner puede publicar resultados durante el envío

- **Estado**: RESUELTO — `Predictions.setResults` y `Predictions.setResultsBatch` ahora exigen que la ventana de submission ya haya cerrado mediante `SubmissionWindowStillOpen()`. Además se actualizaron los helpers compartidos de tests para mover el reloj más allá de `submissionDeadline` antes de publicar resultados cuando el flujo lo requiere.
- **Contrato**: `src/Predictions.sol`
- **Impacto original**: La función sólo chequeaba que las ventas estuvieran cerradas (`_revertIfTournamentSalesOpen`). Si el admin cerraba ventas temprano pero dejaba `submissionDeadline` lejana, podía publicar resultados ANTES del deadline y cortar de facto la ventana de predicciones antes de tiempo.
- **Descripción**: El problema real era de fairness y consistencia operativa más que de "partial submissions": el owner podía adelantar la carga de resultados y bloquear nuevas predicciones sin respetar el deadline anunciado.
- **Fix aplicado**: Se agregó un guard explícito de deadline para `setResults` y `setResultsBatch` usando `_revertIfSubmissionWindowStillOpen()`. Tests agregados: `testSetResultsRevertsBeforeDeadlineEvenWhenSalesClosed` y `testSetResultsBatchRevertsBeforeDeadlineEvenWhenSalesClosed`. También se ajustaron `Predictions.t.sol`, `Treasury.t.sol`, `TournamentSmoke.t.sol`, `Integration.t.sol` y `BaseTest.sol` para expresar correctamente el nuevo invariante temporal.
- **Evaluación GPT**: Confirmado y mitigado. Ahora el contrato fuerza la regla correcta de torneo: ventas cerradas no alcanza; los resultados sólo se publican después de `submissionDeadline`.

---

### [MEDIUM] M-8 — `setTreasuryAddress` no chequea que la dirección sea un contrato ni revoca la integración previa

- **Estado**: RESUELTO — `Carton.setTreasuryAddress` ahora exige que la nueva address tenga código (`code.length > 0`), valida una interfaz mínima con `staticcall` a `isTournamentRegistered(uint256)` y emite `TreasuryAddressChanged(old,new)` para trazabilidad. Tests agregados: `testSetTreasuryAddress`, `testSetTreasuryAddress_RevertEOA` y `testSetTreasuryAddress_RevertInvalidInterface`.
- **Contrato**: `src/Carton.sol`
- **Impacto original**: El admin de Carton podía setear `treasury` a una EOA o a un contrato arbitrario. Eso permitía romper compras futuras por falta de interfaz válida o redirigir el flujo de ventas y approvals hacia un destino malicioso.
- **Descripción**: El riesgo sigue siendo de configuración/admin centralizada, pero ya no alcanza con apuntar accidentalmente a una wallet o a un contrato cualquiera sin la interfaz mínima esperada. El riesgo remanente de una treasury maliciosa deliberadamente configurada debe mitigarse operativamente con multisig/timelock.
- **Fix aplicado**: Se agregó `TreasuryAddressChanged`, `TreasuryAddressNotContract`, `InvalidTreasuryContract` y una validación mínima de compatibilidad antes de aceptar la nueva treasury.
- **Evaluación GPT**: Confirmado y mitigado en la parte onchain razonable. La validación de código + interface probe reduce errores de configuración; el riesgo político/admin se trata fuera de contrato.

---

### [LOW] L-1 — `withdraw()` y `withdrawToken()` en `Carton` permiten al admin extraer cualquier fondo "atrapado" sin distinguir origen

- **Estado**: RESUELTO / DOCUMENTADO — se mantienen como funciones administrativas de rescue, pero ahora emiten `RescueETHWithdrawn(recipient, amount)` y `RescueTokenWithdrawn(recipient, token, amount)` para dar trazabilidad onchain de cualquier retiro excepcional desde `Carton`. Tests agregados: `testWithdraw` (con evento), `testWithdrawToken` y `testWithdrawTokenNoFunds`.
- **Contrato**: `src/Carton.sol`
- **Impacto**: En el flujo normal `Carton` no debería tener saldo (todo va al Treasury inmediatamente vía `depositFromSalesERC20`), pero si alguien envía ETH/ERC20 directamente, el admin puede retirarlo. Esto sigue siendo un riesgo de centralización aceptado para fondos atrapados/rescue, no un vector trustless de robo del flujo normal.
- **Descripción**: `buyCartonWithToken` revierte completo si el deposit falla, por lo que el saldo no debería acumularse en el camino feliz. El caso realista es rescate de ETH/ERC20 enviados directamente o dejados por alguna integración futura no prevista.
- **Fix aplicado**: Se agregaron eventos explícitos de rescue para ETH y ERC20. No se elimina `withdraw()` porque hoy funciona como mecanismo administrativo de recuperación, aunque las compras ETH estén deshabilitadas.
- **Evaluación GPT**: Confirmado como riesgo bajo/centralización aceptable. La transparencia onchain ya quedó cubierta; si más adelante quieren endurecer más, el siguiente paso sería restringir o eliminar rescates que no hagan falta.

---

### [LOW] L-2 — `Carton.setTokenPrice(token, price)` (1 arg) usa `activeTournamentId` pero llama `setTokenPrice(activeTournamentId, ...)` con validación zero

- **Estado**: RESUELTO — la sobrecarga corta `setTokenPrice(token, price)` ahora revierte con `ActiveTournamentNotSet()` cuando `activeTournamentId` todavía no fue configurado. La versión explícita `setTokenPrice(tournamentId, token, price)` mantiene `ZeroTournamentId()` para el caso de `tournamentId == 0`. Tests agregados: `testSetCartonTokenPrice_RevertWhenActiveTournamentNotSet` y `testSetCartonTokenPrice_RevertWhenExplicitTournamentIsZero`.
- **Contrato**: `src/Carton.sol`
- **Impacto original**: La versión abreviada llamaba a la versión completa con `activeTournamentId`, que podía seguir en `0` si nadie había llamado a `setActiveTournament` antes. Eso producía un revert correcto pero poco claro (`ZeroTournamentId`) para el usuario/admin.
- **Fix aplicado**: Se agregó un guard explícito en la sobrecarga corta para distinguir entre "torneo activo no configurado" y "tournamentId explícito inválido".
- **Evaluación GPT**: Confirmado como footgun de UX/dev y ya mitigado con un revert más preciso.

---

### [LOW] L-3 — `Predictions.updateTotalPoints` es public y no actualiza `tokenPositions` — datos inconsistentes

- **Estado**: RESUELTO — se eliminó el cache redundante `totalPoints`, el evento `PointsUpdated` y la función `updateTotalPoints()`. El flujo oficial ya usaba `calculateTotalPoints(tokenId)` para leer puntos on-chain y `tokenPositions` para persistir el ranking publicado, por lo que mantener una segunda storage authority sólo agregaba costo y confusión. Se actualizaron tests y ABI del frontend para reflejar la eliminación.
- **Contrato**: `src/Predictions.sol`
- **Impacto original**: `updateTotalPoints(tokenId)` permitía a cualquier address persistir en storage un cache de puntos que no afectaba al leaderboard oficial. Eso abría una fuente secundaria de datos (`totalPoints`) sin valor operativo real en el flujo actual.
- **Fix aplicado**: Se removió la API y el storage redundante. Los puntos siguen siendo calculables on-chain con `calculateTotalPoints(tokenId)` y el ranking oficial sigue siendo `tokenPositions` / `positionsVersion`.
- **Evaluación GPT**: El hallazgo era más de diseño/UX que de seguridad. El cleanup elimina la ambiguedad en vez de intentar permissionar una función innecesaria.

---

### [LOW] L-4 — `calculateTotalPoints` itera `totalGames` pero accede a `predictions[tokenId][i]` sin verificar longitud

- **Estado**: RESUELTO / DOCUMENTADO — se mantiene el loop sobre `totalGames` porque refleja el invariante actual del contrato: `submitPrediction` exige exactamente `totalGames` entradas y `setTotalGames` queda bloqueado cuando empiezan los envíos. Se agregó una nota explícita en `calculateTotalPoints` para dejar asentado que, si en el futuro se habilitan partial submissions o longitudes menores, habrá que revisar ese bound antes de cambiar el modelo.
- **Contrato**: `src/Predictions.sol`
- **Impacto original**: Si por algún motivo `predictions[tokenId].length < totalGames`, el acceso `predictions[tokenId][i]` revertiría con out-of-bounds. En el diseño actual esa situación no debería ocurrir porque el contrato mantiene el invariante de longitud exacta.
- **Decisión**: No cambiar a `predictions[tokenId].length` por ahora para preservar la semántica estricta actual y evitar suavizar silenciosamente una ruptura del invariante. Se documentó el supuesto en código y en auditoría.
- **Evaluación GPT**: Confirmado como riesgo futuro, no como bug actual. La mitigación elegida fue documentación explícita del invariante.

---

### [LOW] L-5 — `Predictions.abs` puede revertir con `int8` `-128`

- **Estado**: RESUELTO — se aplicaron ambas mitigaciones. `Predictions` ahora valida `goals <= 99` en `submitPrediction`, `setResults`, `setResultsBatch` y `updateResults` mediante `GoalValueTooHigh()`. Además, `calculateDifferencePoints` ya no depende de casts a `int8` y `abs()` fue reescrita con math robusta para no reventar en `-128`. Tests agregados: `testCalculateDifferencePoints_HandlesSubtractionOverflowBoundary`, `testCalculateDifferencePoints_HandlesAbsInt8MinBoundary`, `testSubmitPredictionRevertsOnUnreasonableGoalValue`, `testSetResultsRevertsOnUnreasonableGoalValue`, `testSetResultsBatchRevertsOnUnreasonableGoalValue` y `testUpdateResultsRevertsOnUnreasonableGoalValue`.
- **Contrato**: `src/Predictions.sol`
- **Impacto original**: Inputs de goles mayores a `127` podían truncarse al castearse a `int8` y terminar en overflow durante la resta o en `abs(-128)`. Eso podía revertir el cálculo de puntos y ensuciar el flujo operativo de ranking.
- **Fix aplicado**: Se agregó validación de máximos razonables en las entradas y se endureció la matemática del helper para que incluso llamadas directas con valores raros no fallen por el viejo bug de `int8`.
- **Evaluación GPT**: Confirmado y mitigado con una solución más fuerte que la mínima, cubriendo tanto UX/input sanity como robustez matemática del helper público.

---

### [LOW] L-6 — `Predictions.setSubmissionDeadline` no emite evento

- **Estado**: RESUELTO — `Predictions.setSubmissionDeadline` ahora emite `SubmissionDeadlineUpdated(oldDeadline, newDeadline)` en cada cambio exitoso. Se agregó cobertura en `testSetSubmissionDeadline` y se actualizaron los ABI exportados del frontend.
- **Contrato**: `src/Predictions.sol`
- **Impacto original**: Auditabilidad off-chain. Los cambios de deadline no eran trazables sin parsear cada tx individual.
- **Fix aplicado**: Evento explícito con deadline anterior y nuevo para facilitar indexación, invalidación de caches y monitoreo operativo.
- **Evaluación GPT**: Confirmado y mitigado. Mejora tanto auditabilidad como ergonomía de frontend/indexer.

---

### [LOW] L-7 — `Carton.setAcceptedToken` no emite evento y no valida `token != address(0)`

- **Estado**: RESUELTO — `Carton.setAcceptedToken` ahora revierte con `ZeroTokenAddress` para `address(0)` y emite `AcceptedTokenSet(token, accepted)` en cada cambio. Se agregaron tests para zero-address, evento enable/disable y control de acceso (`onlyAdmin`).
- **Contrato**: `src/Carton.sol:179-189`
- **Impacto original**: Trazabilidad. Setear `acceptedTokens[address(0)] = true` no haría daño porque `_buyCartonWithToken` usa `safeTransferFrom` que revierte sobre `address(0)`, pero es buena práctica validar.
- **Recomendación**: Agregar zero-address check y evento.
- **Fix aplicado**: Guard `if (token == address(0)) revert ZeroTokenAddress()` y `emit AcceptedTokenSet(token, accepted)` en `setAcceptedToken`. Tests cubren revert, evento enable/disable y acceso restringido.
- **Evaluación GPT**: Confirmado y mitigado. Higiene simple que evita estados inválidos y mejora trazabilidad off-chain.

---

### [LOW] L-8 — `Treasury.registerTournament` permite cambiar `competitionEngineByTournament` indefinidamente hasta que se cierren ventas

- **Estado**: RESUELTO — Se mantiene el guard `salesClosed` existente (congelar tras cierre de ventas), pero ahora `registerTournament` emite `CompetitionEngineChanged(tournamentId, oldEngine, newEngine)` cuando se sobrescribe un engine distinto al actual. En el primer registro se emite `TournamentRegistered` como antes. Se agregaron tests para evento, sin-cambio, acceso y reverts.
- **Contrato**: `src/Treasury.sol:126-143`
- **Impacto original**: El admin puede re-registrar el mismo `tournamentId` con un engine distinto mientras `salesClosed == false`. Esto le permite cambiar el motor de scoring después de que algunos users compraron cartones, alterando el juego. Centralización.
- **Recomendación**: Permitir cambio solo antes de la primera venta del torneo (chequear `prizePools[tournamentId][token] == 0` para todos los tokens), o requerir multisig/timelock.
- **Fix aplicado**: Se agregó `event CompetitionEngineChanged(uint256 indexed tournamentId, address indexed oldEngine, address indexed newEngine)` y la lógica en `registerTournament` para emitirlo solo cuando se sobrescribe con un engine diferente. El `TournamentRegistered` se emite únicamente en el primer registro. Tests cubren: primer-registro, re-registro con engine distinto, mismo engine (sin evento), sales-closed revert, zero-id revert, zero-engine revert, access control.
- **Evaluación GPT**: Confirmado y mitigado. La trazabilidad on-chain del cambio permite a indexers/frontends detectar y alertar sobre cambios de engine, manteniendo la posibilidad de hotfix.

---

### [LOW] L-9 — `PredictionsFactory` es código no usado y no testeado, con bugs propios

- **Estado**: RESUELTO — `PredictionsFactory.sol` archivado en `docs/archive/contracts/`. Ya no está en `src/` ni forma parte del build/deploy.
- **Contrato**: `docs/archive/contracts/PredictionsFactory.sol` (archivado)
- **Impacto original**: (a) `setTeamsHash` requiere `onlyOwner` y la factory todavía es owner cuando llama, ok. Pero luego transfiere ownership solo si `owner != address(0)`, dejando una factory huérfana ownering del Predictions si el caller pasa zero. (b) No hay control de acceso en `createTournament`: cualquiera puede crear un torneo y registrarlo en `tournaments[id]`, pero como no se conecta con Treasury, su impacto es nulo. (c) Pisa `tournaments[id]` sin chequear si ya existe (technically siempre nuevo por el counter, ok).
- **Recomendación**: Borrar el contrato (claramente dead code) o (a) protegerlo con `Ownable`, (b) exigir `owner != address(0)`.
- **Fix aplicado**: Archivo movido a `docs/archive/contracts/`, eliminado de `src/`. El deploy y los tests no lo referencian.
- **Evaluación GPT**: Confirmado y mitigado. Dead code eliminado del alcance de compilación y despliegue.

---

### [INFO] I-1 — Solidity `^0.8.27` introduce overhead innecesario en producción

- **Estado**: RESUELTO — Todos los `*.sol` en `src/`, `test/` y `script/` usan `pragma solidity 0.8.27` fijo (sin caret).
- **Contratos**: Todos
- **Recomendación**: Fijar pragma a versión específica probada (`0.8.27` sin caret) para evitar drift entre dev y producción.
- **Evaluación GPT**: Confirmado como recomendación de reproducibilidad. No es vulnerabilidad, pero sí buena práctica para deploys verificables.

---

### [INFO] I-2 — `_nextTokenId` no tiene impacto práctico; `getUserTokens` puede escalar mal para holders grandes

- **Estado**: ACEPTADO / REFORMULADO — No se aplicará un cap artificial de cartones. El riesgo relevante no es overflow sino ergonomía/escala de `getUserTokens(user)` para addresses con muchos cartones.
- **Contrato**: `src/Carton.sol:52-59,256-281`
- **Impacto real**: `_nextTokenId` usa `uint256` y su overflow es teórico. `userTokens[user]` no queda creciendo para siempre si el usuario transfiere o quema, porque `_removeTokenFromUser` ya usa swap-and-pop y reduce el array. El tradeoff real es que un holder con muchísimos cartones puede terminar con un array grande, y `getUserTokens(user)` devuelve todo el contenido en una sola llamada.
- **Recomendación**: Tratar `getUserTokens` como helper de conveniencia y preferir indexación off-chain para holders grandes. Si alguna vez hace falta, agregar un getter paginado tipo `getUserTokensSlice(user, start, count)` en lugar de imponer límites de negocio on-chain.
- **Evaluación GPT**: Confirmado como issue de escalabilidad/ergonomía, no de seguridad. El overflow es irrelevante en la práctica; la observación útil es que el getter completo no escala tan bien como una estrategia paginada o indexada off-chain.

---

### [INFO] I-3 — `Treasury.closeTournament(uint256, address)` es un wrapper deprecado que ignora el parámetro `address`

- **Estado**: RESUELTO — El wrapper fue eliminado. El contrato expone un único entrypoint explícito: `finalizeTournament(uint256 tournamentId)`.
- **Contrato**: `src/Treasury.sol`
- **Recomendación**: Marcar como `@deprecated` en NatSpec o eliminar.
- **Fix aplicado**: Se borró `closeTournament(uint256, address)` y la suite de tests fue migrada a `finalizeTournament(tournamentId)`.
- **Evaluación GPT**: Confirmado y mitigado. Se elimina una API ambigua que podía hacer creer que el cierre dependía del asset cuando en realidad finaliza el torneo completo.

---

### [INFO] I-4 — Uso de `for` con `++i` y caché de `length` reduciría gas

- **Estado**: RESUELTO — Se aplicó una pasada mecánica de micro-optimizaciones de loops en `src/Carton.sol`, `src/Treasury.sol` y `src/Predictions.sol`.
- **Contratos**: `src/Carton.sol`, `src/Treasury.sol`, `src/Predictions.sol`
- **Recomendación**: Optimización menor, no crítica para auditoría.
- **Fix aplicado**: En loops con arrays dinámicos se cacheó `length` localmente y se migró a incrementos `unchecked { ++i; }` cuando el bound del loop lo hace seguro. En loops con `continue`, se reordenaron condiciones para mantener el mismo comportamiento sin dejar incrementos saltables.
- **Evaluación GPT**: Confirmado y mitigado. Sigue siendo una mejora menor, pero ya quedó aplicada sin alterar la semántica observable.

---

### [INFO] I-5 — `Treasury` no expone función para inspeccionar `prizeDistributionTokens` completo

- **Contrato**: `src/Treasury.sol`
- **Detalle**: Hay `getPrizeDistributionTokenCount` pero no `getPrizeDistributionTokens` que devuelva el array. Para indexadores y dashboards admin.
- **Evaluación GPT**: Confirmado como mejora de observabilidad. No afecta seguridad directa, pero reduce errores operativos en admin/dashboard.

---

## 3. Cobertura de tests — observaciones

Suite total: 3871 líneas distribuidas en 7 archivos. Cobertura aparente:

- **Carton.t.sol** (502+ líneas) — cubre roles, pause, mint/burn básico, compras con USDC, integración con Treasury, validaciones de tournament y guards de `setTreasuryAddress` (evento, rechazo de EOA e interfaz inválida). **Faltante**: tests con ERC20 fee-on-transfer (cubre H-2), tests de `_update` con burns parciales y batches grandes (cubre H-3, M-1), tests donde el `treasury` se cambia mid-tournament con efectos sobre flujo ya activo.
- **Treasury.t.sol** (1497+ líneas) — cobertura amplia: deposits, claims, distribuciones, cierres, multi-asset, integración, reentrancy ETH, guards de `sealFinalPrizeAmounts` y `seedTournamentFromReserve` post-sello. Ya cubre M-4 con tests de asset configurado vacío y remoción administrativa segura.
- **Predictions.t.sol** (1204+ líneas) — buena cobertura de submissions, scoring, batched positions, corrección de `officialWinners`, locks de `setSubmissionDeadline` (post-deadline, post-submit, post-cierre de ventas y post-resultados) y guards de fairness para `setResults` / `setResultsBatch` antes del deadline. **Faltante**: tests con `goals > 127` que disparan L-5, tests de manipulación de positions por owner (cubre M-3).
- **TournamentSmoke.t.sol** (369 líneas) — flujos E2E con USDC, roles, batch results y corrección de resultados dentro de la ventana operativa. **Faltante**: un smoke completo que cambie `officialWinners` antes del cierre definitivo para cubrir el camino feliz de H-4 en E2E.
- **Integration.t.sol** y **ERC20Integration.t.sol** — flujos optimistas. Bien.
- **PredictionsFactory.sol** — sin tests dedicados.

---

## 4. Recomendaciones generales priorizadas

1. **Inmediato (antes de mainnet)**:
    - Medir delta de balance en `depositFromSalesERC20` (H-2) o documentar y restringir tokens aceptados.

2. **Corto plazo**:
   - Proteger o eliminar `PredictionsFactory.sol` / flujo huérfano de ownership (M-6).
   - Considerar verificación on-chain de leaderboard via hash commit + ventana de challenge (M-3).

3. **Operativo**:
    - Migrar ownership de `Predictions` y admin de `Treasury`/`Carton` a un multisig (Safe) con timelock para mitigar centralización inherente.
    - Eliminar `PredictionsFactory.sol` o testearlo y protegerlo.
    - Agregar eventos de cambio en setters críticos pendientes (L-6, L-7).

4. **Higiénico / gas**:
    - Fijar pragma exacto.
    - Refactor de duplicados (`all_different` reuso).

---

## Archivos relevantes

- `src/Carton.sol`
- `src/Treasury.sol`
- `src/Predictions.sol`
- `src/PredictionsFactory.sol`
- `script/Deploy.s.sol`
- `test/Predictions.t.sol` (cambios uncommitted: nuevo test `testGetOfficialWinnersReturnsTeamsAndStatus`)
- `test/Treasury.t.sol`
- `test/Carton.t.sol`
- `test/BaseTest.sol`
