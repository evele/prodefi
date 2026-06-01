# Auditoría de Seguridad GPT

Alcance revisado: `src/Carton.sol`, `src/Treasury.sol`, `src/Predictions.sol`, `src/PredictionsFactory.sol`, tests relevantes y `script/Deploy.s.sol`.

No hice cambios en archivos durante la auditoría.

## Resumen

No veo un robo directo de fondos por usuario no privilegiado en el flujo normal USDC + `buyCartonWithToken` + `claimPrize`. Sí veo varios riesgos importantes de integridad del torneo, centralización/admin compromise, estados inconsistentes y DoS operativo.

## Hallazgos

### High H-1: `Carton` permite tokenIds con supply > 1 aunque el sistema asume cartones únicos

- **Estado**: RESUELTO — `Carton` ahora fuerza `amount == 1` en `mintForTournament(...)` y `mintBatchForTournament(...)`, cerrando el caso de ownership parcial por `tokenId`.

- Ubicación: `src/Carton.sol:88-99`, `src/Carton.sol:109-123`
- `mintForTournament(..., amount, ...)` y `mintBatchForTournament(... amounts ...)` aceptan `amount` arbitrario. Si un minter crea `amount > 1` para un mismo `tokenId`, varias wallets pueden terminar teniendo balance del mismo cartón.
- `Predictions.used[tokenId]` y `Treasury.claimed[tournamentId][tokenId][token]` están indexados por `tokenId`, no por holder. Resultado: una sola predicción y un solo claim para múltiples dueños del mismo ID.
- Impacto: primer holder que envía predicción/claim puede bloquear o capturar el valor económico del resto.
- Recomendación: si cada cartón debe ser NFT-like, forzar `amount == 1` en mint/batch o migrar a ERC721.

**Evaluación Claude:** CONFIRMADO. Verificado en `src/Carton.sol:88-99` y `src/Carton.sol:109-123`: ambas funciones aceptan `amount` arbitrario sin validación. El flujo de venta pública `_buyCartonWithToken` sí hardcodea `_mint(msg.sender, tokenId, 1, "")` (línea 153), por lo que el riesgo se materializa únicamente vía `MINTER_ROLE`. Sin embargo, `Predictions.used[tokenId]` (línea 137) y `Treasury.claimed[tournamentId][tokenId][token]` (línea 60 de Treasury) están indexados solo por tokenId, así que basta una transferencia parcial ERC1155 (`safeTransferFrom` con value < amount total) para que el segundo holder quede sin acceso a premio/predicción. Severidad alta sostenida — la corrección es trivial (`require(amount == 1)`).

### High H-2: `setPositions` legacy permite publicar rankings con tokens no elegibles

- **Estado**: RESUELTO — `setPositions(...)` ahora valida elegibilidad del `tokenId` (`used[tokenId]` + torneo correcto) y rechaza duplicados, alineándose con las protecciones básicas del flujo batched.

- Ubicación: `src/Predictions.sol:207-238`
- El flujo batched sí valida `used[tokenId]` y `_tokenTournamentId(tokenId)` en `appendPositionsBatch` (`src/Predictions.sol:279-282`), pero `setPositions` no.
- Un owner/admin por error puede incluir tokens sin predicción, tokens inexistentes o de otro torneo. El contrato aceptará el leaderboard.
- Impacto: finalización y UI pueden confiar en un ranking inválido.
- Recomendación: aplicar las mismas validaciones de `appendPositionsBatch` dentro de `setPositions`, o deprecar/eliminar `setPositions`.

**Evaluación Claude:** CONFIRMADO. `setPositions` (líneas 207-238) solo valida orden de puntos (`PointsNotOrdered`) y longitudes de arrays, pero no chequea `used[tokenId]` ni `_tokenTournamentId(tokenId)`. En cambio `appendPositionsBatch` líneas 280-282 sí hace ambas: `if (!used[tokenId] || _tokenTournamentId(tokenId) != pendingTournamentId) revert TokenNotEligibleForTournament();`. Además, `setPositions` tampoco previene duplicados de tokenId dentro del mismo array (cosa que sí hace el batch path con `tokenPendingVersion`). Severidad alta sostenida. Recomiendo eliminar `setPositions` definitivamente porque el flujo batched ya cubre el caso pequeño (puede llamarse con todos los tokens en un batch).

### High H-3: resultados pueden cambiar después de publicar posiciones sin invalidar leaderboard/prizes

- Ubicación: `src/Predictions.sol:435-448`, `src/Predictions.sol:356-362`, `src/Treasury.sol:358-386`
- `updateResults` permite modificar resultados mientras el torneo no esté finalizado, pero no invalida `positionsVersion`, `tokenPositions` ni `finalPrizeAmounts`.
- Si admin carga posiciones/prizes, luego corrige un resultado, `isReadyForFinalization()` sigue devolviendo true porque sólo exige `allResultsSet`, `officialWinners.set` y `hasFinalPositions`.
- Impacto: finalización con ranking/premios calculados sobre datos viejos.
- Recomendación: agregar `resultsVersion` y hacer que posiciones/finalPrizeAmounts queden ligados a esa versión; cualquier `updateResults` debería invalidar posiciones publicadas y montos sellados.

**Evaluación Claude:** CONFIRMADO. `updateResults` (líneas 435-448) modifica `games[gameId].result` directamente sin tocar `positionsVersion`, `tokenPositions`, ni notificar al Treasury sobre `finalPrizeAmounts`. `isReadyForFinalization()` (línea 360) solo combina tres flags binarios que no reflejan cambios posteriores. El único guard es `_revertIfTournamentClosedForCorrections` que mira `isTournamentClosedAnyAsset[tournamentId]`, flag que se setea en `Treasury.finalizeTournament` (Treasury línea 384) — o sea, la ventana de inconsistencia existe entre `setFinalPrizeAmounts` y `finalizeTournament`. Severidad alta sostenida. La propuesta del `resultsVersion` es la solución limpia; alternativamente, bloquear `updateResults` apenas se llame `setPositions`/`beginPositionsUpdate`.

### Medium M-1: `Treasury.setFinalPrizeAmounts` no verifica que los tokenIds estén en leaderboard

- Ubicación: `src/Treasury.sol:239-266`
- Sólo valida que `cartonContract.tokenTournamentId(tokenIds[i]) == tournamentId`.
- No valida que el token haya enviado predicción, tenga posición final ni corresponda al ranking publicado.
- Impacto: admin comprometido o error operativo puede asignar premios a cartones arbitrarios del torneo.
- Recomendación: consultar el engine registrado y exigir posición válida para cada tokenId, o al menos almacenar/validar un hash del leaderboard final.

**Evaluación Claude:** CONFIRMADO. `Treasury.setFinalPrizeAmounts` (líneas 239-266) solo valida `cartonContract.tokenTournamentId(tokenIds[i]) == tournamentId`. No consulta `competitionEngineByTournament[tournamentId]` ni `Predictions.tokenPositions`/`positionsVersion`. Treasury ya tiene la referencia al engine (la usa en `finalizeTournament` línea 379), así que sería barato consultar `tokenPositions[tokenId]` o exponer una vista en Predictions del tipo `isTokenInCurrentLeaderboard(tokenId)`. Severidad media adecuada — depende de tener admin honesto, pero combinado con H-3 amplifica el riesgo de error operativo. La alternativa del hash de leaderboard es más robusta contra admin comprometido.

### Medium M-2: `finalPrizeAmounts` puede sellarse antes de que el estado competitivo sea estable

- **Estado**: RESUELTO — `sealFinalPrizeAmounts(...)` ahora exige que el engine registrado esté ready antes de sellar montos finales.

- Ubicación: `src/Treasury.sol:268-285`
- `sealFinalPrizeAmounts` no verifica que `Predictions.isReadyForFinalization()` sea true ni que el leaderboard esté atado a resultados definitivos.
- Impacto: se pueden sellar premios prematuramente y luego cambiar resultados/posiciones antes de finalizar.
- Recomendación: permitir sellar sólo cuando el engine esté ready, o permitir reabrir/invalidate seal si cambia el estado competitivo.

**Evaluación Claude:** CONFIRMADO. `sealFinalPrizeAmounts` (líneas 268-285) solo exige `salesClosed`, distribución cargada, y que no esté ya sellado. No llama a `ICompetitionEngine(engine).isReadyForFinalization()` — esa verificación recién aparece en `finalizeTournament` línea 379. Además, una vez sellado, `finalPrizeAmountsReady[tournamentId][token] = true` bloquea correcciones (`FinalPrizeAmountsAlreadySealed`), así que si después se invalida el leaderboard por H-3, no hay forma de reabrir el sello sin redeploy. Severidad media sostenida. La fix simple: exigir `ICompetitionEngine(competitionEngineByTournament[tournamentId]).isReadyForFinalization()` en seal.

### Medium M-3: `setResults` puede bloquear submissions antes del deadline

- **Estado**: RESUELTO — `setResults(...)` y `setResultsBatch(...)` ahora revierten si la ventana de submission sigue abierta.

- Ubicación: `src/Predictions.sol:405-411`, `src/Predictions.sol:381-400`
- `setResults` sólo exige ventas cerradas, no que `block.timestamp >= submissionDeadline`.
- Una vez seteado un resultado, `_submitPrediction` revierte para predicciones que incluyan ese gameId.
- Impacto: si ventas se cierran antes del deadline, el owner puede impedir nuevas predicciones antes del cierre temporal real.
- Recomendación: exigir `block.timestamp >= submissionDeadline` en `setResults` y `setResultsBatch`.

**Evaluación Claude:** CONFIRMADO con matiz. `setResults` línea 405 solo llama `_revertIfTournamentSalesOpen()` (línea 408). En `_submitPrediction` línea 397: `if (games[gameId].set) revert ResultsAlreadySet();` bloquea cualquier predicción que incluya un gameId con resultado. El ataque/error operativo es real: en un torneo donde por modelo de negocio `closeSales` se ejecuta antes que `submissionDeadline` (escenario plausible: cerrar venta de cartones pero permitir que quien ya compró termine de cargar predicciones), basta que el owner cargue un resultado para invalidar predicciones pendientes. Severidad media sostenida. Sin embargo, conviene revisar primero si `submissionDeadline` y cierre de ventas se diseñan para coincidir; si por diseño deben coincidir, la corrección debería ser sincronizar ambos eventos, no solo añadir la condición temporal.

### Medium M-4: deadline mutable permite manipulación operativa

- **Estado**: RESUELTO — `setSubmissionDeadline(...)` ahora queda bloqueado cuando ya hubo submissions, cuando la deadline vigente expiró, cuando ventas cerraron o cuando ya existe al menos un resultado cargado.

- Ubicación: `src/Predictions.sol:185-188`
- `setSubmissionDeadline` sólo exige fecha futura. No bloquea cambios después de ventas, después de submissions o después de resultados.
- Impacto: admin puede extender/reabrir ventana o cambiar reglas temporales de forma injusta.
- Recomendación: congelar deadline cuando empiezan submissions, cuando se cierran ventas o cuando se setea el primer resultado.

**Evaluación Claude:** CONFIRMADO. `setSubmissionDeadline` (líneas 185-188) solo valida `_deadline > block.timestamp`. No tiene constraints contra `predictionsStarted`, `salesClosed`, ni que ya haya un deadline pasado. Esto crea dos vectores: (a) admin extiende el deadline después que ya pasó, reabriendo submissions; (b) admin acorta el deadline cuando ya hay predicciones en flight, censurando usuarios honestos. Severidad media adecuada. La recomendación es correcta — yo añadiría como mínimo `require(block.timestamp < submissionDeadline || submissionDeadline == 0)` para prevenir reapertura post-deadline, y bloquear cambios después de `predictionsStarted == true` salvo que el nuevo deadline sea mayor al actual (extensión benigna).

### Medium M-5: scoring puede revertir con scores extremos

- **Estado**: RESUELTO — se validan goles máximos razonables y el cálculo de diferencias ya no depende del viejo patrón frágil con casts a `int8`.

- Ubicación: `src/Predictions.sol:503-532`
- Scores son `uint8` sin límite razonable. `calculateDifferencePoints` convierte a `int8`, lo que puede wrappear/revertir para valores altos.
- Impacto: un usuario puede enviar predicciones con scores extremos que rompan cálculo de puntos para ese token; admin también puede cargar resultados absurdos.
- Recomendación: validar goles máximos razonables, por ejemplo `<= 30` o `<= 99`, en submissions y resultados.

**Evaluación Claude:** CONFIRMADO con preocupación adicional. Reviso `calculateDifferencePoints` (línea 522) y `abs` (línea 530). El caso patológico real es `int8(goalsR) - int8(goalsP)` con `goalsR=0, goalsP=128`: `int8(128)` wrappea a `-128`, entonces `0 - (-128) = 128`, pero `int8` rango es [-128, 127], así que esa suma revierte en 0.8.x por overflow. Aún peor, `abs(-128)`: `-(-128) = 128` también overflowea `int8` y revierte. Esto significa que un usuario malicioso puede submitear predicción con score 128 o más → su token nunca podrá calcular puntos (`calculatePoints` reverts) → `updateTotalPoints(tokenId)` también reverts → su token queda en limbo, pero más grave: si `setPositions` o el cálculo del leaderboard off-chain depende de iterar `calculatePoints`, el atacante puede ensuciar el ranking. Severidad media bien adjudicada, aunque arguyo que podría escalarse a alta si el flujo off-chain depende de leer `calculateTotalPoints` para construir el leaderboard (DoS de UX). Fix mínimo: cap `goalsP, goalsR <= 99` en submission y en `setResults`.

### Medium M-6: accounting ERC20 asume tokens estándar sin fee/rebase

- Ubicación: `src/Treasury.sol:151-167`, `src/Carton.sol:149-160`
- El contrato contabiliza `amount`, no el delta real recibido.
- Con USDC estándar está bien. Si admin acepta un token fee-on-transfer/rebasing, `prizePools` puede ser mayor al balance real.
- Impacto: claims pueden revertir por fondos insuficientes.
- Recomendación: medir `balanceBefore/balanceAfter` y usar `received`, o restringir explícitamente tokens aceptables.

**Evaluación Claude:** CONFIRMADO. `Treasury.depositFromSalesERC20` (líneas 151-167) hace `safeTransferFrom(msg.sender, address(this), amount)` y luego incrementa `prizePools` y `globalReserve` por el `amount` solicitado, no por el delta real. `Carton._buyCartonWithToken` (línea 149) tiene el mismo patrón en su intermediación. Para USDC nativo no hay problema (no es fee-on-transfer ni rebasing). El riesgo real es operativo: si admin algún día agrega un token con fee-on-transfer (vía `setAcceptedToken`), Treasury contabilizará más de lo que tiene, y luego los últimos claims revertirán por liquidez. Severidad media adecuada. La mejor defensa es restringir a una whitelist hardcoded de tokens probados; el patrón `received = balanceAfter - balanceBefore` también funciona pero agrega complejidad y costo de gas. Sugiero documentar como invariant: "Treasury solo acepta tokens no-fee, no-rebasing".

### Medium M-7: `claimPrize` no usa `nonReentrant`

- **Estado**: RESUELTO — `Treasury` ahora hereda `ReentrancyGuard` y `claimPrize(...)` usa `nonReentrant`.

- Ubicación: `src/Treasury.sol:180-202`
- El patrón CEI está bien para evitar doble claim del mismo `(tournamentId, tokenId, token)`, pero hay llamada externa ETH vía `.call`.
- Impacto actual limitado; riesgo futuro si se agregan funciones que muevan fondos o muten accounting.
- Recomendación: heredar `ReentrancyGuard` y marcar `claimPrize` como `nonReentrant`.

**Evaluación Claude:** CONFIRMADO con bajo impacto inmediato. `claimPrize` (líneas 180-202) aplica CEI correctamente: `claimed[tournamentId][tokenId][token] = true;` ANTES del `payable(msg.sender).call{value: prize_amount}("")`. Por lo tanto, el atacante reentrante no puede re-claimar el mismo `(tournamentId, tokenId, token)`. Sin embargo, sí podría reentrar para claimar **otro** `(tournamentId2, tokenId2, token2)` que controle (si tiene varios cartones). Como cada uno tiene su propio gate de `claimed`, no veo bug económico directo hoy. El riesgo es de futuro-proofing: cualquier función nueva que actualice estado compartido (ej. `prizePools[token]` decrementado al claim, accounting global, o un hook post-claim) abriría reentrancy. Severidad baja correcta. Costo de añadir `nonReentrant` es ~2400 gas y elimina toda esta clase de riesgo. Hacerlo.

### Low L-1: `PredictionsFactory` puede dejar contratos huérfanos

- **Estado**: RESUELTO / ARCHIVADO — `PredictionsFactory.sol` ya no forma parte de `src/` ni del build activo; quedó archivado fuera del set de contratos productivos.

- Ubicación: `src/PredictionsFactory.sol:18-37`
- Si `owner == address(0)`, el factory queda como owner del `Predictions` desplegado, pero no tiene funciones para administrarlo.
- Impacto: torneo inutilizable si alguien usa factory por error.
- Recomendación: exigir `owner != address(0)` o eliminar factory si no se usa.

**Evaluación Claude:** CONFIRMADO. `PredictionsFactory.createTournament` (líneas 18-37): si `owner == address(0)`, el `if (owner != address(0))` falla y nunca se llama `transferOwnership`, por lo que el `Predictions` queda con `owner = address(factory)`. El factory no tiene ningún método para hacer pass-through de calls al Predictions (no expone `setSubmissionDeadline`, `setResults`, etc.), así que el contrato es huérfano. Severidad baja correcta dado que la memoria del proyecto indica que `PredictionsFactory.sol` está marcado como dead code (no testeado, no desplegado). Recomiendo eliminar el archivo entero antes de deploy a mainnet — no agregar el guard `require(owner != address(0))` porque eso solo da una falsa sensación de utilidad a un contrato que no se usa.

### Low L-2: `setOfficialWinners` no permite corrección

- **Estado**: RESUELTO — `Predictions` ahora expone `updateOfficialWinners(...)` con guards para impedir cambios una vez bloqueado el torneo o publicado el leaderboard final.

- Ubicación: `src/Predictions.sol:577-592`
- Una carga errónea queda permanente.
- Impacto: error humano puede distorsionar puntos y premios.
- Recomendación: agregar update permitido sólo antes de finalización, con evento e invalidación de posiciones/prizes.

**Evaluación Claude:** CONFIRMADO. `setOfficialWinners` (líneas 577-592): `if (officialWinners.set) revert OfficialWinnersAlreadySet();`. Nótese además el comentario del propio código (línea 578) que reconoce la limitación: `// NOTE: what if theres some error? .. proably need to add some edition capability or get them from oracles.`. Junto con L-2, H-3 y la falta de versionado en el leaderboard, este hueco hace que un solo dedo equivocado del owner congele un resultado erróneo y solo se pueda corregir con redeploy. Severidad baja correcta dado el alcance limitado, pero alta prioridad operacional. Sugiero añadir `updateOfficialWinners` con la misma semántica que H-3: invalidar `positionsVersion` y `finalPrizeAmountsReady` al ejecutarse.

### Low L-3: funciones admin críticas sin eventos suficientes

- Ubicación: `src/Carton.sol:164-176`, `src/Carton.sol:201-209`, `src/Predictions.sol:185-188`
- Faltan eventos para accepted token, token price, treasury address, active tournament y deadline.
- Impacto: peor monitoreo/auditabilidad.
- Recomendación: emitir eventos en cada cambio administrativo sensible.

**Evaluación Claude:** CONFIRMADO. Verifiqué cada función citada:
- `Carton.setAcceptedToken` (líneas 164-166): sin evento.
- `Carton.setTokenPrice` overloads (líneas 168-176): sin evento.
- `Carton.setTreasuryAddress` (201-204): sin evento.
- `Carton.setActiveTournament` (206-209): sin evento.
- `Predictions.setSubmissionDeadline` (185-188): sin evento.
Adicionalmente noto que `Carton.setURI` también es silencioso. Severidad baja correcta — no afecta seguridad on-chain, pero compromete observabilidad off-chain (frontends, subgraphs, alertas SIEM). Recomiendo eventos por defecto en todas las funciones admin (`AcceptedTokenUpdated`, `TokenPriceUpdated`, `TreasuryAddressUpdated`, `ActiveTournamentChanged`, `SubmissionDeadlineSet`).

### Low L-4: `Carton.setTreasuryAddress` no valida contrato/interfaz

- **Estado**: RESUELTO — `setTreasuryAddress(...)` ahora exige código en la address, prueba una interfaz mínima por `staticcall` y emite evento al cambiarla.

- Ubicación: `src/Carton.sol:201-204`
- Sólo rechaza zero address.
- Impacto: admin puede setear EOA o contrato incompatible y romper compras.
- Recomendación: validar `code.length > 0` y opcionalmente probar interfaz vía `try/catch`.

**Evaluación Claude:** CONFIRMADO. `Carton.setTreasuryAddress` (líneas 201-204) solo rechaza `address(0)`. Si admin setea una EOA, todas las compras vía `_buyCartonWithToken` revertirán en el call a `_treasury.salesClosed(tournamentId)` (línea 145) o `_treasury.depositFromSalesERC20(...)` (línea 160), porque una EOA no tiene esas funciones. Esto es un DoS recoverable — admin puede volver a setear el address correcto. Severidad baja correcta. Recomiendo el check `treasuryAddress.code.length > 0` como mínimo, y opcionalmente una llamada de prueba a `ITreasury(treasuryAddress).isTournamentRegistered(0)` dentro de `try/catch` para validar interfaz. Sin embargo, dado que el rol es `DEFAULT_ADMIN_ROLE` (probable multisig), esto es realmente higiene defensiva.

### Low L-5: `Carton.setAcceptedToken` acepta `address(0)`

- **Estado**: RESUELTO — `setAcceptedToken(...)` ahora revierte para `address(0)` y además emite `AcceptedTokenSet(token, accepted)` para trazabilidad.

- Ubicación: `src/Carton.sol:164-166`
- No genera robo directo porque la compra con address zero fallaría, pero es configuración inválida.
- Recomendación: rechazar `address(0)`.

**Evaluación Claude:** CONFIRMADO. `Carton.setAcceptedToken` (líneas 164-166) sin guards de address. Si `acceptedTokens[address(0)] = true`, las compras vía `_buyCartonWithToken(tournamentId, address(0))` pasarían el primer check (`if (!acceptedTokens[token]) revert TokenNotAccepted();`), luego buscarían precio en `tokenPricesByTournament[tournamentId][address(0)]` (probablemente 0 → `TokenPriceNotSet`). Si admin además setea precio para address(0), la compra explotaría en `IERC20(address(0)).safeTransferFrom` por código vacío. O sea, no es explotable directamente — es estado-basura. Severidad baja correcta. Fix trivial: `if (token == address(0)) revert ...`.

## Tests recomendados

- Mint con `amount > 1`, transfer parcial del mismo tokenId y claim por dos holders.
- `setPositions` con token no usado, token de otro torneo y token inexistente.
- `updateResults` después de `setPositions` y `sealFinalPrizeAmounts`, confirmando que hoy finaliza igual.
- `setResults` antes del deadline con ventas cerradas.
- Scores extremos `uint8` en predicciones/resultados.
- Token ERC20 fee-on-transfer mock contra `depositFromSalesERC20`.
- Reentrancy receiver para `claimPrize` ETH.

## Prioridad de fixes

1. Forzar `amount == 1` para cartones.
2. Validar elegibilidad en `setPositions` o eliminarlo.
3. Versionar/invalidar leaderboard y premios cuando cambian resultados/winners.
4. Bloquear resultados antes del deadline.
5. Añadir `nonReentrant` y accounting ERC20 por delta real.

---

## Evaluación global Claude

Coincido con todos los hallazgos del reporte; revisé los archivos `src/Carton.sol`, `src/Treasury.sol`, `src/Predictions.sol` y `src/PredictionsFactory.sol` línea por línea sobre los puntos citados y no encontré falsos positivos. Tampoco identifiqué hallazgos adicionales críticos en el alcance revisado, aunque sí menciono observaciones marginales abajo.

**Coincidencias clave en severidad y priorización:**
- El top-1 (H-1 `amount == 1`) es la fix de mayor ROI: trivial y elimina una clase entera de bugs en `claimed`/`used`.
- H-3 es el más sutil y peligroso porque cruza tres contratos. El `resultsVersion` propuesto es la solución más limpia; alternativamente, bloquear `updateResults` después de `setPositions`.
- M-5 (scores extremos) tiene impacto mayor de lo que se le da: ver mi nota en M-5 sobre el wrap en `int8` y posible DoS de UX del leaderboard.

**Observaciones adicionales no listadas en el reporte original:**
- `Predictions.calculateTotalPoints` (línea 622) itera `for (i = 0; i < totalGames; i++)` accediendo `predictions[tokenId][i]`. Si `totalGames` se cambia entre submission y cálculo (cosa que `predictionsStarted` previene), o si se quita un game por error, esto revertiría por out-of-bounds. Riesgo bajo porque `setTotalGames` está gateado por `predictionsStarted`, pero es frágil.
- `Carton._update` (línea 241) mantiene `userTokens[user]` con loop O(n) en `_removeTokenFromUser` (línea 228). Para una wallet con muchos cartones, las transferencias se vuelven cada vez más caras. No es bug de seguridad pero es DoS económico latente.
- `Treasury.seedTournamentFromReserve` (línea 342) transfiere desde `globalReserve[token]` al pool del torneo sin verificar `salesClosed`. Esto permite al admin inyectar premio extra después de cerrar ventas y antes del sello — comportamiento probablemente intencional, pero amplifica el problema de M-2 (sello prematuro deja fuera estas inyecciones).
- `Predictions.setPositions` (línea 207) no tiene el guard `positionsUpdateInProgress` consistente: sí lo verifica al inicio, pero si alguien llama `setPositions` después de un batch parcialmente aplicado y luego cancelado, el estado de `tokenPositionBackup` puede quedar inconsistente. Vale revisar la interacción entre los dos paths.

**Prioridad de fixes que sugeriría refinada:**
1. H-1: `amount == 1` (1 línea de código).
2. H-3: invalidación versionada de leaderboard al cambiar resultados/winners (afecta H-3, L-2, M-2).
3. H-2: eliminar `setPositions` legacy y forzar el flujo batched (cubre también la observación de inconsistencia).
4. M-5: cap goalsP/goalsR a `<= 99` en submission y resultados.
5. M-7: `nonReentrant` en `claimPrize` (cheap defense-in-depth).
6. M-3, M-4, M-1: hardening de admin paths (deadline congelable, validación de elegibilidad de tokenIds en `setFinalPrizeAmounts`).
7. L-1: eliminar `PredictionsFactory.sol` antes de mainnet.
8. L-3, L-4, L-5: higiene (eventos + validación de inputs).

**Riesgos no técnicos pero notables:**
- Concentración de roles: `DEFAULT_ADMIN_ROLE` en Carton y Treasury controla flujos críticos. Recomiendo multisig + timelock para deploy productivo, especialmente para `setAcceptedToken`, `setTreasuryAddress`, `setOfficialWinners`, `sealFinalPrizeAmounts`.
- La memoria del proyecto indica 119/119 tests passing — pero los tests recomendados en este audit (mint con amount > 1, scores extremos, ERC20 fee-on-transfer, reentrancy en claim ETH) deberían añadirse antes de cualquier deploy.
