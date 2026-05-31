# Auditoría de Seguridad — Proyecto ProDefi

**Rama auditada**: `small-fixes`
**Fecha**: 2026-05-28
**Alcance**: Smart contracts en `src/` (`Carton.sol`, `Treasury.sol`, `Predictions.sol`, `PredictionsFactory.sol`)

---

## Resumen ejecutivo

El sistema se compone de cuatro contratos: `Carton` (ERC1155 vendedor de "cartones"), `Treasury` (custodia multi-asset de pools de premios), `Predictions` (motor de juego/scoring por torneo) y `PredictionsFactory` (dead code, no usado en `Deploy.s.sol`). El diseño hereda buenas piezas de OpenZeppelin (AccessControl, SafeERC20, ReentrancyGuard, ERC1155Pausable) y separa razonablemente las responsabilidades, pero presenta varias debilidades de severidad alta y media: contabilidad ERC20/ETH desacoplada de saldos reales con riesgo de DoS por tokens fee-on-transfer/rebasing y varios puntos donde el owner puede atascar el torneo (DoS por centralización). La inconsistencia grave de `userTokens` por ownership parcial fue mitigada al forzar `amount == 1` por cartón, el índice `userTokens` ahora usa remove O(1), y los ganadores oficiales ahora pueden corregirse antes de publicar el leaderboard final. No se encontró ninguna vulnerabilidad crítica explotable de robo directo de fondos por un actor no privilegiado.

| Severidad | Cantidad |
|-----------|----------|
| Critical  | 0        |
| High      | 2        |
| Medium    | 7        |
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

- **Contrato**: `src/Predictions.sol:185-188`
- **Impacto**: El owner puede llamar `setSubmissionDeadline` después de que la deadline anterior expirara, mientras no haya restricción de "una vez vencida no se puede mover". Esto permite re-abrir el envío de predicciones para tokens nuevos, dándole a usuarios con info posterior una ventaja injusta (front-running de outcomes ya conocidos). Combinado con el hecho de que `setResults` requiere que las ventas estén cerradas pero NO chequea deadline, el owner podría: (1) cerrar ventas, (2) ver resultados parciales, (3) extender deadline, (4) mintear/asignar cartones a una cuenta propia y enviar predicciones "perfectas".
- **Descripción**: La función sólo valida `_deadline > block.timestamp`. No hay flag de "frozen" ni guard de "no se puede modificar si ya empezó a haber resultados oficiales".
- **Recomendación**: Bloquear `setSubmissionDeadline` cuando (a) ya pasó la deadline original, o (b) cualquier `games[i].set == true`, o (c) `predictionsStarted == true` (al menos no se puede REDUCIR si ya hay submits, y no se puede AUMENTAR si ya hubo resultados). Un patrón sano: permitir extender sólo hasta un máximo absoluto fijado al constructor, y bloquear cualquier movimiento una vez seteado el primer resultado.
- **Evaluación GPT**: Confirmado. Yo lo elevaría en prioridad operativa porque permite manipular fairness del torneo sin tocar fondos directamente. La regla mínima debería ser: no cambiar deadline después de ventas cerradas o después del primer resultado.

---

### [MEDIUM] M-3 — `setPositions` (legacy) y `appendPositionsBatch` permiten arbitrar el ranking sin verificación on-chain

- **Contrato**: `src/Predictions.sol:207-238, 259-309`
- **Impacto**: El leaderboard se calcula off-chain. El owner declara `_predictionPoints` que sólo se valida como "no creciente" (ordenado descendentemente). NO se compara contra `calculateTotalPoints(tokenId)` on-chain. Un owner deshonesto puede declarar puntos arbitrarios para favorecer cartones propios y empujarlos a las primeras posiciones de pago. Como Treasury usa `finalPrizeAmounts` (también declarado por el admin), el owner controla 100% el pago final.
- **Descripción**: El TODO en la línea 203-206 ya identifica este riesgo: "Final leaderboard integrity improvements". Es una decisión de diseño consciente pero representa un riesgo de centralización alto.
- **Recomendación**: Como mínimo: (1) En `appendPositionsBatch` recomputar y validar `calculateTotalPoints(tokenId) == pointValue` y revertir si difiere (esto es costoso pero es la única defensa real). (2) Como mitigación más liviana: publicar un `leaderboardHash` (commit) y permitir desafíos durante una ventana N días (mencionado en el TODO). (3) Mover ownership a un multisig / timelock.
- **Evaluación GPT**: Confirmado, y agregaría que `setPositions` legacy es peor que el batch porque ni siquiera valida `used[tokenId]` ni torneo. Si no se puede verificar puntos onchain por gas, al menos conviene deprecar `setPositions` y exigir el flujo batched con validaciones mínimas.

---

### [MEDIUM] M-4 — `Treasury.finalizeTournament` recorre `prizeDistributionTokens` sin bound y revierte si un pool quedó vacío

- **Contrato**: `src/Treasury.sol:358-386`
- **Impacto**: Si el admin llamó `setPrizeDistribution(tournamentId, tokenX, ...)` para un token donde después no entró ninguna venta (`pool == 0`), `finalizeTournament` revierte siempre por `NoPrizePool` (línea 369). Resultado: torneo no finalizable hasta que el admin agregue fondos manualmente vía `seedTournamentFromReserve` o limpie la entrada (no hay función para remover un token de `prizeDistributionTokens`). DoS administrativo del flujo de finalización.
- **Descripción**: Adicionalmente, en cada iteración se hace `if (!finalPrizeAmountsReady[tournamentId][token]) revert FinalPrizeAmountsNotSealed();` — esto requiere haber sellado TODOS los tokens, lo cual es razonable, pero combinado con la imposibilidad de des-registrar un token es un footgun.
- **Recomendación**: Permitir al admin remover un token de `prizeDistributionTokens` antes de la finalización; o saltar (continue) los tokens con `pool == 0` y `finalPrizeAmountTotals == 0`; o emitir un evento de skipped en lugar de revertir.
- **Evaluación GPT**: Confirmado como footgun administrativo. No lo considero explotable por usuario no privilegiado, pero sí puede bloquear finalización si el admin configura un asset por error. Severidad **Medium** razonable.

---

### [MEDIUM] M-5 — `seedTournamentFromReserve` no actualiza `closedPrizePools` ni interactúa correctamente con el flujo de sellado

- **Contrato**: `src/Treasury.sol:342-355`
- **Impacto**: Si el admin sembró el pool desde reserva DESPUÉS de haber sellado los amounts finales (`finalPrizeAmountsReady[token] = true`), el `prizePools[tournamentId][token]` aumentaría pero `finalPrizeAmountTotals` queda igual y al finalizar (línea 373) `closedPrizePools` toma el valor inflado. Como `getUserPrizeAmount` para tournament finalizado usa `closedPrizePools` * percentage / 100, la view function devolvería un monto distinto al que realmente recibirán los usuarios (los users reciben `finalPrizeAmounts`, no porcentajes). Inconsistencia entre vistas y realidad; potencial confusión y reportes erróneos.
- **Descripción**: No hay revert si se llama post-sello, lo cual abre una vía para inflar artificialmente la vista del prize pool sin afectar pagos.
- **Recomendación**: Revertir `seedTournamentFromReserve` si `finalPrizeAmountsReady[token] == true` (o agregar lógica para reabrir el sello). Alternativamente, deprecar `getUserPrizeAmount` para tournament finalizado y exponer únicamente `finalPrizeAmounts`.
- **Evaluación GPT**: Confirmado. El principal daño es inconsistencia UI/accounting, no pérdida directa. La corrección más limpia es bloquear `seedTournamentFromReserve` cuando `finalPrizeAmountsReady[tournamentId][token]` ya está sellado.

---

### [MEDIUM] M-6 — Owner del `Predictions` no se valida en el constructor; deploy con address(0) → contrato inutilizable

- **Contrato**: `src/Predictions.sol:165-169`
- **Impacto**: El constructor usa `Ownable(msg.sender)`. Si el deploy se hace desde un contrato factory que después transfiere ownership a `address(0)` o no la transfiere, todas las funciones `onlyOwner` quedan inalcanzables. Concretamente `PredictionsFactory.createTournament` acepta `owner == address(0)` y NO transfiere ownership (línea 29-31), dejando al factory como owner permanente — pero el factory no tiene función para invocar los setters. Inhabilita totalmente el flujo.
- **Descripción**: `PredictionsFactory.sol` está marcado como dead code, pero queda desplegado y podría usarse por error.
- **Recomendación**: En `PredictionsFactory.createTournament`, validar `require(owner != address(0))` y transferir siempre. En `Predictions` añadir override de `transferOwnership` que rechace `address(0)` (Ownable de OZ ya lo hace por defecto, pero documentarlo).
- **Evaluación GPT**: Parcialmente confirmado. El riesgo real está en `PredictionsFactory`, no en el constructor de `Predictions`, porque `Ownable(msg.sender)` es válido en deploy directo. Ajustaría el título para centrarlo en la factory huérfana. Severidad **Low/Medium** si la factory no se usa.

---

### [MEDIUM] M-7 — `setResults` no exige que la deadline haya pasado; el owner puede publicar resultados durante el envío

- **Contrato**: `src/Predictions.sol:405-411`
- **Impacto**: La función sólo chequea que las ventas estén cerradas (`_revertIfTournamentSalesOpen`). En el flujo normal, ventas cerradas → deadline pasada (intuitivamente), pero no hay invariante. Si el admin cierra ventas en Treasury muy temprano pero deja `submissionDeadline` lejana, el owner puede publicar resultados ANTES de la deadline y usuarios pueden seguir submiteando predicciones con info de resultados publicados. Front-running de outcomes.
- **Descripción**: `submitPrediction` (línea 382) chequea deadline pero no estado de `games[i].set`. Sin embargo en línea 397 revierte con `ResultsAlreadySet` si intenta submitear una predicción para un partido cuyos resultados ya están seteados — eso mitiga parcialmente, pero un atacante puede submitear sólo gameIds que aún no tienen resultado publicado, manipulando un subset. Como `totalGames` requeridos es fijo, el ataque exige no haber seteado ningún resultado todavía, lo que reduce el riesgo a la ventana entre "primer setResults" y "deadline".
- **Recomendación**: Requerir `block.timestamp >= submissionDeadline` en `setResults` y `setResultsBatch`. O bloquear el envío de predicciones si cualquier `games[i].set` está activo.
- **Evaluación GPT**: Confirmado. La mitigación parcial por `ResultsAlreadySet` no alcanza como regla de torneo; lo correcto es que resultados sólo puedan cargarse después del deadline. Prioridad alta para fairness.

---

### [MEDIUM] M-8 — `setTreasuryAddress` no chequea que la dirección sea un contrato ni revoca la integración previa

- **Contrato**: `src/Carton.sol:201-204`
- **Impacto**: El admin de Carton puede setear `treasury` a una dirección EOA o a un contrato malicioso (e.g., uno que siempre marque `salesClosed == false`). Esto le permite redirigir las ventas futuras y los `forceApprove` posteriores (línea 159 hace `forceApprove(treasury, amount)`) a un destino arbitrario. Vector de rug por admin.
- **Descripción**: Riesgo de centralización. No hay timelock ni evento de cambio (no hay event emit en setTreasuryAddress; sí hay validación de zero address pero nada más).
- **Recomendación**: Agregar evento `TreasuryAddressChanged(old,new)`, considerar timelock vía multisig/Timelock controller (off-chain), y opcionalmente forzar que la nueva dirección implemente `isTournamentRegistered` (chequeo simple via try-catch o staticcall).
- **Evaluación GPT**: Confirmado como riesgo de configuración/admin. No es un exploit trustless, pero una mala address rompe compras y una address maliciosa puede alterar el flujo de ventas. Agregaría validación `treasuryAddress.code.length > 0`.

---

### [LOW] L-1 — `withdraw()` y `withdrawToken()` en `Carton` permiten al admin extraer cualquier fondo "atrapado" sin distinguir origen

- **Contrato**: `src/Carton.sol:188-199`
- **Impacto**: En el flujo normal `Carton` no debería tener saldo (todo va al Treasury inmediatamente vía `depositFromSalesERC20`), pero si alguien envía ETH/ERC20 directamente, el admin puede retirarlo. Si la integración con Treasury falla por alguna razón en el medio de `_buyCartonWithToken`, los tokens del usuario quedan en `Carton` hasta que el admin los retire. Vector de fondos atrapados + centralización para retiro.
- **Descripción**: Como `buyCartonWithToken` revierte completo si el deposit falla (línea 160), el saldo no debería acumularse en el flujo normal. Pero `withdraw()` (ETH) es de uso desconocido porque `buyCarton()` revierte siempre. Function dead-code-ish.
- **Recomendación**: Considerar emitir evento detallado de withdraw para auditoría off-chain; opcionalmente eliminar `withdraw()` ya que ETH no entra al contrato por flujo normal.
- **Evaluación GPT**: Confirmado como riesgo bajo/centralización aceptable si se documenta. Dado que compras ETH están deshabilitadas, `withdraw()` es principalmente rescue; conviene emitir eventos para transparencia.

---

### [LOW] L-2 — `Carton.setTokenPrice(token, price)` (1 arg) usa `activeTournamentId` pero llama `setTokenPrice(activeTournamentId, ...)` con validación zero

- **Contrato**: `src/Carton.sol:168-176`
- **Impacto**: La versión deprecada (1 arg) llamará a la versión completa con `activeTournamentId`, que será 0 si nadie llamó a `setActiveTournament` antes — produciendo `ZeroTournamentId`. Si bien esto es una validación correcta, la mejor UX sería un revert explícito.
- **Recomendación**: Cambiar el revert a uno más explícito como `ActiveTournamentNotSet` o eliminar la versión deprecada (1 arg).
- **Evaluación GPT**: Confirmado como UX/dev-footgun, no seguridad material. Mantendría baja severidad.

---

### [LOW] L-3 — `Predictions.updateTotalPoints` es public y no actualiza `tokenPositions` — datos inconsistentes

- **Contrato**: `src/Predictions.sol:636-641`
- **Impacto**: Cualquier usuario puede invocar `updateTotalPoints(tokenId)` para sobrescribir `totalPoints[tokenId]` con el cálculo on-chain en ese momento. Esto es informativo pero no influye en el leaderboard final (que está en `tokenPositions`/`tokenPositionsVersion`). Genera dos fuentes de verdad: `totalPoints` (recalculable on-chain) vs `tokenPositions` (publicado off-chain). Si el frontend usa `totalPoints` para mostrar al usuario su score, puede divergir del ranking publicado.
- **Descripción**: No es un bug per se, pero invita confusión.
- **Recomendación**: Documentar claramente la semántica (mejor) o restringir a `onlyOwner` (más seguro pero rompe UX).
- **Evaluación GPT**: Confirmado. No restringiría necesariamente a `onlyOwner` porque es cálculo público derivado; preferiría documentar que `totalPoints` es cache informativo y que el ranking oficial es `tokenPositions`.

---

### [LOW] L-4 — `calculateTotalPoints` itera `totalGames` pero accede a `predictions[tokenId][i]` sin verificar longitud

- **Contrato**: `src/Predictions.sol:617-633`
- **Impacto**: Si por algún motivo `predictions[tokenId].length < totalGames` (por ejemplo si `setTotalGames` fuera modificable después de envíos — actualmente está bloqueado por `predictionsStarted`, OK), el acceso `predictions[tokenId][i]` revertiría con out-of-bounds. Hoy es seguro porque `submitPrediction` exige exactamente `totalGames`. Es un riesgo si en el futuro se permite parcial submissions.
- **Recomendación**: Iterar `i < predictions[tokenId].length` o `min(totalGames, predictions[tokenId].length)`.
- **Evaluación GPT**: Confirmado como riesgo futuro. En el diseño actual está protegido por `WrongPredictionCount` y `predictionsStarted`, así que lo mantendría como **Low**.

---

### [LOW] L-5 — `Predictions.abs` puede revertir con `int8` `-128`

- **Contrato**: `src/Predictions.sol:530-532`
- **Impacto**: `abs(int8 x)` con `x = -128` haría `-x = 128` que excede `int8.max = 127`. Revierte con overflow en Solidity 0.8. En la práctica, los inputs vienen de `int8(goalsR) - int8(goalsP)` con `goalsR`/`goalsP` siendo `uint8`, así que el rango efectivo es `[-255, 255]`, pero el cast a `int8` antes de la resta hace truncate. Si `goalsR=200, goalsP=72`, `int8(200) = -56`, `int8(72) = 72`, `-56 - 72 = -128`. `abs(-128)` revierte. Goles de un partido > 127 es físicamente imposible pero el contrato no lo previene; el owner podría meter valores arbitrarios en `setResults`.
- **Recomendación**: Validar `goals <= 99` (o similar) en `setResults` y `submitPrediction`. O reescribir `abs` con math más robusta (`x >= 0 ? uint8(x) : uint8(-int16(x))`).
- **Evaluación GPT**: Confirmado. Yo priorizaría validar goles máximos razonables en input, porque también protege la UX y evita scores absurdos, no sólo el overflow de `int8`.

---

### [LOW] L-6 — `Predictions.setSubmissionDeadline` no emite evento

- **Contrato**: `src/Predictions.sol:185-188`
- **Impacto**: Auditabilidad off-chain. Los cambios de deadline no son trazables sin parsear cada tx individual.
- **Recomendación**: Agregar `event SubmissionDeadlineUpdated(uint256 old, uint256 new)`.
- **Evaluación GPT**: Confirmado. Además de auditabilidad, este evento ayudaría al frontend/indexer a invalidar caches y mostrar cambios de reglas temporales.

---

### [LOW] L-7 — `Carton.setAcceptedToken` no emite evento y no valida `token != address(0)`

- **Contrato**: `src/Carton.sol:164-166`
- **Impacto**: Trazabilidad. Setear `acceptedTokens[address(0)] = true` no haría daño porque `_buyCartonWithToken` usa `safeTransferFrom` que revierte sobre `address(0)`, pero es buena práctica validar.
- **Recomendación**: Agregar zero-address check y evento.
- **Evaluación GPT**: Confirmado. Es higiene simple y evita estados inválidos innecesarios. También agregaría evento para precio por torneo/token.

---

### [LOW] L-8 — `Treasury.registerTournament` permite cambiar `competitionEngineByTournament` indefinidamente hasta que se cierren ventas

- **Contrato**: `src/Treasury.sol:119-131`
- **Impacto**: El admin puede re-registrar el mismo `tournamentId` con un engine distinto mientras `salesClosed == false`. Esto le permite cambiar el motor de scoring después de que algunos users compraron cartones, alterando el juego. Centralización.
- **Recomendación**: Permitir cambio solo antes de la primera venta del torneo (chequear `prizePools[tournamentId][token] == 0` para todos los tokens), o requerir multisig/timelock.
- **Evaluación GPT**: Confirmado. Como el engine define readiness/finalización, cambiarlo después de ventas afecta la confianza del torneo. Mínimo: emitir evento y bloquear cambios tras primera venta o tras `salesClosed`.

---

### [LOW] L-9 — `PredictionsFactory` es código no usado y no testeado, con bugs propios

- **Contrato**: `src/PredictionsFactory.sol`
- **Impacto**: (a) `setTeamsHash` requiere `onlyOwner` y la factory todavía es owner cuando llama, ok. Pero luego transfiere ownership solo si `owner != address(0)`, dejando una factory huérfana ownering del Predictions si el caller pasa zero. (b) No hay control de acceso en `createTournament`: cualquiera puede crear un torneo y registrarlo en `tournaments[id]`, pero como no se conecta con Treasury, su impacto es nulo. (c) Pisa `tournaments[id]` sin chequear si ya existe (technically siempre nuevo por el counter, ok).
- **Recomendación**: Borrar el contrato (claramente dead code) o (a) protegerlo con `Ownable`, (b) exigir `owner != address(0)`.
- **Evaluación GPT**: Confirmado. Si no está en el flujo de deploy, la opción más segura es eliminarlo o moverlo a archivo experimental fuera de `src/`. Si se mantiene, necesita tests.

---

### [INFO] I-1 — Solidity `^0.8.27` introduce overhead innecesario en producción

- **Contratos**: Todos
- **Recomendación**: Fijar pragma a versión específica probada (`0.8.27` sin caret) para evitar drift entre dev y producción.
- **Evaluación GPT**: Confirmado como recomendación de reproducibilidad. No es vulnerabilidad, pero sí buena práctica para deploys verificables.

---

### [INFO] I-2 — `Carton._nextTokenId` empieza en 1 y nunca se resetea — overflow en uint256 es teórico pero el array `userTokens` crece sin límite

- **Contrato**: `src/Carton.sol:45`
- **Recomendación**: Ver M-1.
- **Evaluación GPT**: Confirmado. El overflow es irrelevante en la práctica; el problema real es crecimiento sin bound de `userTokens`.

---

### [INFO] I-3 — `Treasury.closeTournament(uint256, address)` es un wrapper deprecado que ignora el parámetro `address`

- **Contrato**: `src/Treasury.sol:389-391`
- **Recomendación**: Marcar como `@deprecated` en NatSpec o eliminar.
- **Evaluación GPT**: Confirmado. Mantener wrappers que ignoran parámetros es confuso y puede inducir integraciones incorrectas; si debe seguir por compatibilidad, documentarlo explícitamente.

---

### [INFO] I-4 — Uso de `for` con `++i` y caché de `length` reduciría gas

- **Contratos**: Todos
- **Recomendación**: Optimización menor, no crítica para auditoría.
- **Evaluación GPT**: Confirmado. No lo priorizaría hasta cerrar los riesgos funcionales y de integridad.

---

### [INFO] I-5 — `Predictions.calculateTotalPoints` puede revertir en `calculatePoints` si `games[gameId].set` se interrumpe en mitad de iteración

- **Contrato**: `src/Predictions.sol:617-633`
- **Detalle**: Hay `continue` en línea 623 si el juego no está seteado, pero `calculatePoints` también chequea `if (!game.set) revert ResultNotSet();` en 506. La doble verificación es defensiva pero el `continue` ya filtra; no hay bug, sólo redundancia.
- **Evaluación GPT**: Confirmado. No lo considero issue de seguridad; es redundancia legible y aceptable.

---

### [INFO] I-6 — `setOfficialWinners` permite duplicados sólo si el chequeo `all_different` no se ejecuta — pero usa otro patrón

- **Contrato**: `src/Predictions.sol:582-587`
- **Detalle**: La función inlinea el chequeo de duplicados en doble loop. Es equivalente al `all_different` que ya existe (línea 556). Refactor sugerido: reutilizar `all_different`.
- **Evaluación GPT**: Confirmado. Es sólo mantenimiento; no cambia seguridad mientras ambos loops sigan equivalentes.

---

### [INFO] I-7 — `Treasury.setFinalPrizeAmounts` no valida `amounts[i] > 0`

- **Contrato**: `src/Treasury.sol:239-266`
- **Detalle**: `claimPrize` revierte con `NoPrizeAvailable` si `prize_amount == 0`, así que cargar amount=0 es equivalente a no incluir el tokenId. No es bug, pero podría agregarse validación para feedback temprano.
- **Evaluación GPT**: Confirmado. Validar `amounts[i] > 0` daría mejor feedback, pero hay casos legítimos donde setear 0 puede funcionar como borrado antes del sello. Si se quiere permitir borrado, documentarlo.

---

### [INFO] I-8 — `Treasury` no expone función para inspeccionar `prizeDistributionTokens` completo

- **Contrato**: `src/Treasury.sol`
- **Detalle**: Hay `getPrizeDistributionTokenCount` pero no `getPrizeDistributionTokens` que devuelva el array. Para indexadores y dashboards admin.
- **Evaluación GPT**: Confirmado como mejora de observabilidad. No afecta seguridad directa, pero reduce errores operativos en admin/dashboard.

---

## 3. Cobertura de tests — observaciones

Suite total: 3871 líneas distribuidas en 7 archivos. Cobertura aparente:

- **Carton.t.sol** (502 líneas) — cubre roles, pause, mint/burn básico, compras con USDC, integración con Treasury, validaciones de tournament. **Faltante**: tests con ERC20 fee-on-transfer (cubre H-2), tests de `_update` con burns parciales y batches grandes (cubre H-3, M-1), tests donde el `treasury` se cambia mid-tournament (cubre M-8).
- **Treasury.t.sol** (1370 líneas) — cobertura amplia: deposits, claims, distribuciones, cierres, multi-asset, integración. **Faltante**: tests de re-entrancy en `claimPrize` (cubre H-1), tests de `seedTournamentFromReserve` post-sello (cubre M-5), tests con `prizeDistributionTokens` poblado pero sin pool (cubre M-4).
- **Predictions.t.sol** (1111 líneas) — buena cobertura de submissions, scoring, batched positions. El diff sólo agrega un test simple para el nuevo `getOfficialWinners`. **Faltante**: tests de `setSubmissionDeadline` post-deadline (cubre M-2), tests de `setResults` antes de deadline (cubre M-7), tests con `goals > 127` que disparan L-5, tests de manipulación de positions por owner (cubre M-3).
- **TournamentSmoke.t.sol** (369 líneas) — flujos E2E con USDC, roles, batch results. **Faltante**: flujo completo con corrección de `officialWinners` (cubre H-4) — naturalmente falta porque no existe la función.
- **Integration.t.sol** y **ERC20Integration.t.sol** — flujos optimistas. Bien.
- **PredictionsFactory.sol** — sin tests dedicados.

---

## 4. Recomendaciones generales priorizadas

1. **Inmediato (antes de mainnet)**:
   - Implementar H-4 (corrección de `officialWinners`) y M-7 (deadline guard en setResults). Bajo costo, alto retorno.
   - Refactor `userTokens` en `Carton` (H-3, M-1) — elimina riesgo de DoS por gas y datos corruptos.
   - Pasar `Treasury` a `ReentrancyGuard` (H-1) — defensive coding barato.
   - Medir delta de balance en `depositFromSalesERC20` (H-2) o documentar y restringir tokens aceptados.

2. **Corto plazo**:
   - Restringir movimientos de `setSubmissionDeadline` (M-2).
   - Bloquear `seedTournamentFromReserve` post-sello (M-5).
   - Permitir des-registrar tokens vacíos en finalize (M-4).
   - Considerar verificación on-chain de leaderboard via hash commit + ventana de challenge (M-3).

3. **Operativo**:
   - Migrar ownership de `Predictions` y admin de `Treasury`/`Carton` a un multisig (Safe) con timelock para mitigar centralización inherente.
   - Eliminar `PredictionsFactory.sol` o testearlo y protegerlo.
   - Agregar eventos de cambio en setters críticos (L-6, L-7, M-8).

4. **Higiénico / gas**:
   - Fijar pragma exacto.
   - Refactor de duplicados (`all_different` reuso).
   - Documentar la semántica de `updateTotalPoints` (L-3) o restringirlo.

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
