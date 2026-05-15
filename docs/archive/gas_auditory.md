# Gas Analysis Report - ProDefi

**Date**: 2026-03-14
**Last updated**: 2026-03-19

> Nota de estado: `PositionsUpdated` **se mantiene** por decisión de producto/operación. Aunque hoy el frontend no dependa del evento, no se considera candidato a eliminación en esta iteración.

## Contract Sizes

### Before (2026-03-14)

| Contract | Size (B) | % del limite 24KB | Estado |
|---|---|---|---|
| **Carton** | 20,780 | **86%** | WARN - Cerca del limite |
| Predictions | 18,230 | 76% | OK |
| Treasury | 12,900 | 54% | OK |
| PredictionsFactory | 20,430 | 85% | WARN - Dead code |

### After (2026-03-19)

| Contract | Size (B) | % del limite 24KB | Delta | Estado |
|---|---|---|---|---|
| **Carton** | 19,859 | **80.8%** | **-921 B** | OK - Margen recuperado |
| Predictions | 13,710 | 55.8% | **-4,520 B** | OK |
| Treasury | 10,494 | 42.7% | **-2,406 B** | OK |
| PredictionsFactory | 15,814 | 64.3% | - | Sin cambios directos (baja por dependencia de Predictions) |

Total bytecode eliminado: **~7,847 bytes** across 3 contracts.

## Top 10 Funciones Mas Caras (gas promedio - pre-optimization)

| Rank | Contract | Function | Avg Gas |
|---|---|---|---|
| 1 | Predictions | `submitPrediction` | 299,320 |
| 2 | Carton | `buyCartonWithToken` | 185,738 |
| 3 | Predictions | `setPositions` | 168,257 |
| 4 | Carton | `buyCarton` | 141,033 |
| 5 | Carton | `mint` | 138,590 |
| 6 | Predictions | `updateTotalPoints` | 126,910 |
| 7 | Predictions | `predictWinners` | 94,275 |
| 8 | Predictions | `setOfficialWinners` | 89,822 |
| 9 | Predictions | `calculateTotalPoints` | 79,554 |
| 10 | Treasury | `claimPrize` | 72,482 |

## Findings

### HIGH Priority

#### Finding 1: SLOADs redundantes en `calculatePoints` -- FIXED

- **Status**: FIXED (2026-03-19)
- **Location**: `src/Predictions.sol:203-226`
- **Category**: Storage
- **Issue**: `calculatePoints` hacia 8 lecturas separadas de storage con `predictions[tokenId][index]` y `games[predictions[tokenId][index].gameId]`. Cada mapping doble resuelve 2 slots por acceso.
- **Fix applied**: Cacheado en variables locales:
  ```solidity
  Prediction memory pred = predictions[tokenId][index];
  Game storage game = games[pred.gameId];
  ```
- **Measured savings**: `testPointsCalculation` paso de 990,640 a 936,052 gas (**-54,588 gas**). En produccion con 72 games el ahorro escala linealmente.

#### Finding 2: `memory` en vez de `calldata` en `setPositions` -- FIXED

- **Status**: FIXED (2026-03-19)
- **Location**: `src/Predictions.sol:129`
- **Category**: Calldata
- **Issue**: Ambos arrays `_predictionIds` y `_predictionPoints` usaban `memory`, copiando toda la calldata a memoria.
- **Fix applied**: Cambiados a `calldata`.
- **Savings**: ~200 gas por elemento. En L2 cada byte de calldata tiene costo base adicional.

#### Finding 3: Raw `transferFrom` - BUG DE CORRECTNESS -- FIXED

- **Status**: FIXED (2026-03-19)
- **Location**: `src/Carton.sol:108`
- **Category**: Execution / Safety
- **Issue**: `buyCartonWithToken` usaba `require(IERC20(token).transferFrom(...), "Transfer failed")`. Tokens como USDT que retornan `void` en vez de `bool` causarian que el require SIEMPRE reverta, incluso en transfers exitosos.
- **Fix applied**: Reemplazado por `IERC20(token).safeTransferFrom(msg.sender, address(this), amount)`.
- **Measured savings**: `testBuyCartonWithToken` paso de 274,733 a 274,686 gas (**-47 gas** + correctness fix).

#### Finding 4: SLOADs redundantes en Treasury -- FIXED

- **Status**: FIXED (2026-03-19)
- **Location**: `src/Treasury.sol:87-113`
- **Category**: Storage
- **Issue**: `claimPrize` leia `prizePoolDistributions[tournamentId][token]` dos veces. `closeTournament` leia `prizePools` y luego re-leia `closedPrizePools` para el emit.
- **Fix applied**: En `claimPrize`, cacheado como `storage` pointer y `closedPool` local. En `closeTournament`, cacheado `pool` y reutilizado para el emit.
- **Measured savings**: `test_ClaimPrize_Success` paso de 2,426,017 a 2,370,101 gas (**-55,916 gas**). `test_CloseTournament_Success` paso de 178,613 a 178,091 gas (**-522 gas**).

### MEDIUM Priority

#### Finding 5: SLOAD caching en `buyCarton*` -- FIXED

- **Status**: FIXED (2026-03-19)
- **Location**: `src/Carton.sol:92-96, 117-123`
- **Category**: Storage
- **Issue**: `buyCarton` y `buyCartonWithToken` leian `treasury` y `activeTournamentId` de storage sin cachear.
- **Fix applied**: Cacheado en variables locales `_treasury` y `_tournamentId`.
- **Measured savings**: `testBuyCarton_WithTreasury` paso de 3,097,621 a 2,733,234 gas (**-364,387 gas**). Nota: en el path sin treasury hay +2K gas overhead del cache, aceptable dado el ahorro con treasury activa.

#### Finding 6: `immutable` deberia ser `constant` -- FIXED

- **Status**: FIXED (2026-03-19)
- **Location**: `src/Predictions.sol:20-24`
- **Category**: Storage
- **Issue**: `LOCAL`, `EMPATE`, `VISITANTE`, `MAX_TEAM_ID`, y `MAX_WINNERS` eran `immutable` pero son literales compile-time.
- **Fix applied**: Cambiados todos a `uint8 constant`.
- **Savings**: ~20-40 gas por funcion que los lee, reduce initcode size. Contribuye a la reduccion de 4,133 bytes en Predictions.

#### Finding 7: Loop doble en `submitPrediction` -- FIXED

- **Status**: FIXED (2026-03-19)
- **Location**: `src/Predictions.sol:161-178`
- **Category**: Execution
- **Issue**: `submitPrediction` iteraba `_prediction` dos veces: primer pass validaba, segundo pass escribia a storage.
- **Fix applied**: Fusionados en un solo loop que valida y hace `push` en la misma iteracion. Variable local `gameId` evita accesos repetidos a calldata.
- **Measured savings**: `testSubmitPredictionBeforeDeadline` paso de 349,490 a 343,144 gas (**-6,346 gas** con 4 games). Para 72 games: ~114K gas estimados.

#### Finding 8: Eliminar array `positions`, dejar solo mapping -- FIXED

- **Status**: FIXED (2026-03-19)
- **Location**: `src/Predictions.sol:104-165`, `src/Carton.sol:38-40`
- **Category**: Storage
- **Issue**: `positions` (array) y `tokenPositions` (mapping) se mantienen simultaneamente. El array solo se usa en `getPositions()` (view off-chain) y en el evento `PositionsUpdated`. El delete-and-repopulate del array es lo mas caro de `setPositions`.
- **Fix applied**: Eliminado `positions` del storage y removido `getPositions()`. `setPositions()` ahora actualiza `tokenPositions`, versiona el leaderboard con `positionsVersion`, y marca cada entry con `tokenPositionsVersion` para invalidar ranks viejos sin limpiar storage. El frontend reconstruye el leaderboard leyendo `Carton.nextTokenId()` y consultando `Predictions.tokenPositions(tokenId)` + `Predictions.tokenPositionsVersion(tokenId)` por multicall.
- **Measured impact**: `Predictions` bajo **-4,520 bytes** vs baseline inicial (18,230 -> 13,710). El ahorro bruto de eliminar el array existe, pero parte fue compensado por el versionado agregado para preservar correctitud en re-rankeos.
- **Note**: La idea alternativa de usar logs + `lastPositionsBlock` se guarda para futuro en `DEVELOPMENT_PLAN.md`, pero no fue necesaria para esta iteracion.

#### Finding 8b: `tokenPositions` + `tokenPositionsVersion` ocupan 2 slots por token -- PENDIENTE

- **Status**: PENDIENTE
- **Location**: `src/Predictions.sol` - `setPositions()` / `getCartonPosition()`
- **Category**: Storage
- **Issue**: El refactor del leaderboard resolvio el array en storage, pero ahora cada token rankeado escribe dos mappings: `tokenPositions[tokenId]` y `tokenPositionsVersion[tokenId]`. Eso mantiene correctitud, pero sigue costando 2 escrituras por entrada al refrescar posiciones.
- **Fix propuesto**: Empaquetar `version + position` en un solo slot (`mapping(uint256 => uint256) packedPosition`) y decodificarlo en `getCartonPosition()`.
- **Expected impact**: ahorro de ~1 `SSTORE` por token rankeado en cada `setPositions()`, ademas de una lectura menos en `getCartonPosition()`.

#### Finding 9: `all_different` memory -> calldata -- FIXED

- **Status**: FIXED (2026-03-19)
- **Location**: `src/Predictions.sol:257`
- **Category**: Calldata
- **Issue**: `all_different(uint8[4] memory teams)` forzaba copia a memoria cuando el caller ya tenia los datos en calldata.
- **Fix applied**: Cambiado parametro a `calldata`.
- **Savings**: ~100 gas por `predictWinners`.

#### Finding 10: Custom errors en vez de require strings -- FIXED

- **Status**: FIXED (2026-03-19)
- **Location**: Todos los contratos
- **Category**: Execution / Bytecode size
- **Issue**: Todos los reverts usaban `require(condition, "string literal")`. Cada string ocupa bytecode y cuesta gas adicional al revertir.
- **Fix applied**: Definidos custom errors en cada contrato y reemplazados ~41 `require` calls con `if (!cond) revert CustomError()`:
  - Carton.sol: 11 custom errors, 10 requires reemplazados
  - Predictions.sol: 23 custom errors, 21 requires reemplazados
  - Treasury.sol: 13 custom errors, 13 requires reemplazados
  - Tests actualizados para usar `vm.expectRevert(Contract.Error.selector)`
- **Measured savings**: Carton -983 bytes, Predictions -4,133 bytes, Treasury -1,510 bytes. Total: **-6,626 bytes de bytecode**.

### LOW Priority

#### Finding 11: `getSupportedAssets` incompleta -- FIXED

- **Status**: FIXED (2026-03-19)
- **Location**: `src/Treasury.sol`
- **Category**: Dead/broken code
- **Issue**: Aloca array fijo de 2, solo checkea ETH, nunca popula el slot ERC20, copia a array resized. Siempre retorna como mucho `[address(0)]`.
- **Fix applied**: Eliminada la funcion. El frontend no la usaba; los assets siguen siendo configurados explicitamente en UI.
- **Measured savings**: `Treasury` bajo otros **-896 bytes** de runtime size.

#### Finding 13: Ruta ERC20 de compra sigue pagando `approve + transferFrom` -- PENDIENTE

- **Status**: PENDIENTE
- **Location**: `src/Carton.sol` (`buyCartonWithToken()`), `src/Treasury.sol` (`depositFromSalesERC20()`)
- **Category**: Execution
- **Issue**: En compras ERC20, `Carton` hace `approve()` al `Treasury` y luego `Treasury` hace `transferFrom()`. Eso agrega una llamada externa y escritura de allowance en el hot path de compra.
- **Fix propuesto**: pasar a push-model (`Carton` transfiere directo a `Treasury`) o dejar approval persistente si el modelo actual se mantiene.
- **Expected impact**: varios miles de gas menos por compra ERC20.

#### Finding 14: `userTokens` sigue siendo O(n) al remover -- PENDIENTE

- **Status**: PENDIENTE
- **Location**: `src/Carton.sol` - `_removeTokenFromUser()`
- **Category**: Execution / Storage
- **Issue**: Para burns/transfers, se copia `userTokens[user]` a memoria y se busca linealmente el token a borrar.
- **Fix propuesto**: mantener `mapping(address => mapping(uint256 => uint256)) tokenIndexPlusOne` para borrado O(1) con swap-and-pop en storage.
- **Expected impact**: ahorro claro en transfers/burns de usuarios con muchos cartones.

#### Finding 15: `PredictionsFactory.sol` sigue pareciendo dead code -- PENDIENTE

- **Status**: PENDIENTE
- **Location**: `src/PredictionsFactory.sol`
- **Category**: Dead code
- **Issue**: El deploy actual y los tests instancian `Predictions` directamente; `PredictionsFactory` sigue sin consumidores reales.
- **Fix propuesto**: borrar, archivar, o excluir del build/deploy path principal.
- **Expected impact**: reduce superficie de mantenimiento y ~15.8KB del output compilado.

#### Finding 16: Micro-optimizaciones de loops -- PENDIENTE

- **Status**: PENDIENTE
- **Location**: varios loops en `src/Predictions.sol`, `src/Carton.sol`, `src/Treasury.sol`
- **Category**: Execution
- **Issue**: Quedan `i++` checked en loops con bounds ya garantizados.
- **Fix propuesto**: usar `unchecked { ++i; }` donde corresponda.
- **Expected impact**: ahorro bajo pero acumulativo en loops largos.

#### Finding 12: PredictionsFactory.sol dead code -- PENDIENTE (no action)

- **Status**: PENDIENTE - decision: dejarlo como esta por ahora
- **Location**: `src/PredictionsFactory.sol`
- **Category**: Dead code
- **Issue**: No tiene tests, no se deploya, ocupa 16,201 bytes (66% del limite).
- **Fix propuesto**: Borrar o mover a `src/archive/`.
- **Savings**: Elimina ~16KB del build output.

## Resumen de Impacto

| Priority | Finding | Contract | Status | Savings Medidos |
|---|---|---|---|---|
| HIGH | F1: SLOADs en `calculatePoints` | Predictions | FIXED | -54,588 gas en test (escala x72 en prod) |
| HIGH | F2: `memory` -> `calldata` en `setPositions` | Predictions | FIXED | ~200 gas/entry |
| HIGH | F3: Raw `transferFrom` (BUG) | Carton | FIXED | Correctness fix para USDT |
| HIGH | F4: SLOADs en Treasury | Treasury | FIXED | -55,916 gas en claimPrize |
| MEDIUM | F5: Cache `treasury`/`activeTournamentId` | Carton | FIXED | -364,387 gas con treasury activa |
| MEDIUM | F6: `immutable` -> `constant` | Predictions | FIXED | Bytecode reduction |
| MEDIUM | F7: Loop doble en `submitPrediction` | Predictions | FIXED | -6,346 gas (4 games) |
| MEDIUM | F8: Eliminar array `positions` | Predictions | FIXED | -4,520 bytes vs baseline |
| HIGH | F8b: Packed `version+position` | Predictions | PENDIENTE | ~1 SSTORE menos por token rankeado |
| MEDIUM | F9: `all_different` calldata | Predictions | FIXED | ~100 gas |
| MEDIUM | F10: Custom errors | Todos | FIXED | -6,626 bytes bytecode total |
| LOW | F11: `getSupportedAssets` rota | Treasury | FIXED | -896 bytes bytecode |
| MEDIUM | F13: `approve + transferFrom` ERC20 | Carton/Treasury | PENDIENTE | varios miles gas por compra |
| MEDIUM | F14: `userTokens` O(n) | Carton | PENDIENTE | mejora transfers/burns |
| LOW | F15: PredictionsFactory dead code | - | PENDIENTE | ~16KB del build |
| LOW | F16: `unchecked` loops | Varios | PENDIENTE | micro-ahorros |

### Test Results Post-Optimization

- **116 tests passed, 0 failed, 0 skipped**
- Build: `forge build` successful (warnings only in test files)
- Frontend: `npm run build` successful
- `forge fmt`: applied

### Key Gas Comparisons (test suite)

| Test | Before | After | Savings |
|---|---|---|---|
| `testPointsCalculation` | 990,640 | 934,179 | **-56,461** |
| `testCompleteWorkflow` | 1,999,435 | 1,907,433 | **-92,002** |
| `testMultipleUsersCompetition` | 1,960,652 | 1,905,335 | **-55,317** |
| `test_ClaimPrize_Success` | 2,426,017 | 2,368,027 | **-57,990** |
| `testBuyCarton_WithTreasury` | 3,097,621 | 2,553,606 | **-544,015** |
| `testSetTreasuryAddress` | 2,838,155 | 2,294,265 | **-543,890** |
| `testSubmitPredictionBeforeDeadline` | 349,490 | 343,144 | **-6,346** |
| `test_CloseTournament_Success` | 178,613 | 178,067 | **-546** |
