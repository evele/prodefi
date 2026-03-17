# Gas Analysis Report - ProDefi

**Date**: 2026-03-14

## Contract Sizes

| Contract | Size (KB) | % del limite 24KB | Estado |
|---|---|---|---|
| **Carton** | 20.78 | **86%** | WARN - Cerca del limite |
| Predictions | 18.23 | 76% | OK |
| Treasury | 12.90 | 54% | OK |
| PredictionsFactory | 20.43 | 85% | WARN - Dead code |

Carton es el contrato mas restringido. Cualquier feature nueva es riesgosa sin optimizar primero.

## Top 10 Funciones Mas Caras (gas promedio)

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

#### Finding 1: SLOADs redundantes en `calculatePoints`

- **Location**: `src/Predictions.sol:205-224`
- **Category**: Storage
- **Issue**: `calculatePoints` hace 8 lecturas separadas de storage con `predictions[tokenId][index]` y `games[predictions[tokenId][index].gameId]`. Cada mapping doble resuelve 2 slots por acceso. La expresion `predictions[tokenId][index]` aparece 6 veces y `games[...]` aparece 4 veces.
- **Fix**: Cachear en variables locales al inicio de la funcion:
  ```solidity
  Prediction memory pred = predictions[tokenId][index];
  Game storage game = games[pred.gameId];
  ```
  Luego referenciar `pred` y `game` en todo el cuerpo.
- **Savings**: ~1,600-2,000 gas por llamada a `calculatePoints`. Como `calculateTotalPoints` lo llama 72 veces, se compone a ~115,000-144,000 gas por invocacion - **reduccion potencial del 90%+**.

#### Finding 2: `memory` en vez de `calldata` en `setPositions`

- **Location**: `src/Predictions.sol:129`
- **Category**: Calldata (critico en L2)
- **Issue**: `setPositions(uint256[] memory _predictionIds, uint256[] memory _predictionPoints)` - ambos arrays son `memory`, lo que copia toda la calldata a memoria en el entry.
- **Fix**: Cambiar ambos parametros a `calldata`. La funcion solo los lee, nunca los modifica.
- **Savings**: ~200 gas por elemento (~20,000 gas para leaderboard de 100 entries). En L2 cada byte de calldata tiene costo base adicional.

#### Finding 3: Raw `transferFrom` - BUG DE CORRECTNESS

- **Location**: `src/Carton.sol:108`
- **Category**: Execution / Safety
- **Issue**: `buyCartonWithToken` usa `IERC20(token).transferFrom(...)` con check manual via `require(... , "Transfer failed")`. El contrato ya importa `SafeERC20` y usa `using SafeERC20 for IERC20` pero esta llamada lo skipea. **Tokens como USDT que retornan `void` en vez de `bool` causarian que este `require` SIEMPRE reverta**, incluso en transfers exitosos.
- **Fix**: Reemplazar `require(IERC20(token).transferFrom(...), "Transfer failed")` con `IERC20(token).safeTransferFrom(msg.sender, address(this), amount)`.
- **Savings**: 0 gas, pero **corrige un bug que bloquea USDT y tokens similares**.

#### Finding 4: SLOADs redundantes en Treasury

- **Location**: `src/Treasury.sol:87-110`
- **Category**: Storage
- **Issue**: `claimPrize` lee `prizePoolDistributions[tournamentId][token]` dos veces (length check y acceso por indice). `closeTournament` lee `closedPrizePools[tournamentId][token]` dos veces (write y luego re-read para emit).
- **Fix**: En `claimPrize`, cachear como `storage` pointer. En `closeTournament`, usar el valor ya conocido para el emit.
- **Savings**: ~200-400 gas por `claimPrize`, ~200 gas por `closeTournament`.

### MEDIUM Priority

#### Finding 5: SLOAD caching en `buyCarton*`

- **Location**: `src/Carton.sol:92,116`
- **Category**: Storage
- **Issue**: En `buyCarton` y `buyCartonWithToken`, se lee `address(treasury)` y `activeTournamentId` de storage como checks separados en el hot purchase path.
- **Fix**: Cachear al inicio:
  ```solidity
  ITreasury _treasury = treasury;
  uint256 _tournamentId = activeTournamentId;
  if (address(_treasury) != address(0) && _tournamentId > 0) { ... }
  ```
- **Savings**: ~100-200 gas por compra cuando treasury esta configurado.

#### Finding 6: `immutable` deberia ser `constant`

- **Location**: `src/Predictions.sol:20-24`
- **Category**: Storage
- **Issue**: `LOCAL`, `EMPATE`, `VISITANTE`, `MAX_TEAM_ID`, y `MAX_WINNERS` son `immutable` pero son literales de compile-time que nunca varian entre deployments. `immutable` usa `CODECOPY` en runtime; `constant` inlinea el valor directamente.
- **Fix**: Cambiar todos de `uint8 immutable` a `uint8 constant`.
- **Savings**: ~20-40 gas por funcion que los lee, reduce initcode size.

#### Finding 7: Loop doble en `submitPrediction`

- **Location**: `src/Predictions.sol:161-183`
- **Category**: Execution
- **Issue**: `submitPrediction` itera `_prediction` dos veces: primer pass valida game IDs y deduplicacion, segundo pass escribe a storage. Paga calldata reads doble.
- **Fix**: Fusionar en un solo loop - validar y `push` en la misma iteracion.
- **Savings**: ~50-100 gas por entry. Para 72 games: ~3,600-7,200 gas por `submitPrediction`.

#### Finding 8: Eliminar array `positions`, dejar solo mapping

- **Location**: `src/Predictions.sol:81-82`
- **Category**: Storage
- **Issue**: `positions` (array) y `tokenPositions` (mapping) se mantienen simultaneamente. El array solo se usa en `getPositions()` (view off-chain) y en el evento `PositionsUpdated`. El delete-and-repopulate del array es lo mas caro de `setPositions`.
- **Fix**: Eliminar `positions` storage array. Emitir la lista ordenada en el evento directamente desde calldata. Off-chain consumers leen el event log.
- **Savings**: Para leaderboard de 100 entries: ~100 x 20,000 gas (cold SSTOREs) = **~2,000,000 gas** eliminados. Warm re-writes: ~290,000 gas ahorrados.

#### Finding 9: `all_different` memory -> calldata

- **Location**: `src/Predictions.sol:262`
- **Category**: Calldata
- **Issue**: `all_different(uint8[4] memory teams)` toma el array por `memory`. Se llama desde `predictWinners` que ya tiene los teams en `calldata`.
- **Fix**: Cambiar parametro a `calldata`.
- **Savings**: ~100 gas por `predictWinners`.

#### Finding 10: Custom errors en vez de require strings

- **Location**: Todos los contratos
- **Category**: Execution / Bytecode size
- **Issue**: Todos los reverts usan `require(condition, "string literal")`. Cada caracter cuesta 8 gas en calldata al revertir, y el string ocupa bytecode.
  - Carton.sol: 10 `require` calls
  - Predictions.sol: 18 `require` calls
  - Treasury.sol: 13 `require` calls
- **Fix**: Definir custom errors y usar `if (!cond) revert CustomError()`. Custom errors cuestan 4 bytes vs 100+ bytes para strings.
- **Savings**: ~50-200 gas por revert. **~500-1,500 bytes de bytecode** - critico para Carton al 86% del limite.

### LOW Priority

#### Finding 11: `getSupportedAssets` incompleta

- **Location**: `src/Treasury.sol:171-191`
- **Category**: Dead/broken code
- **Issue**: Aloca array fijo de 2, solo checkea ETH, nunca popula el slot ERC20, copia a array resized. Siempre retorna como mucho `[address(0)]`.
- **Fix**: Implementar correctamente con registry de assets por tournament, o eliminar.
- **Savings**: Eliminar ahorra ~300-500 bytes de bytecode.

#### Finding 12: PredictionsFactory.sol dead code

- **Location**: `src/PredictionsFactory.sol`
- **Category**: Dead code
- **Issue**: No tiene tests, no se deploya, ocupa 20,924 bytes (85% del limite).
- **Fix**: Borrar o mover a `src/archive/`.
- **Savings**: Elimina 20KB del build output.

## Resumen de Impacto

| Priority | Finding | Contract | Savings Clave |
|---|---|---|---|
| HIGH | SLOADs en `calculatePoints` | Predictions | ~90% reduccion en `calculateTotalPoints` |
| HIGH | `memory` -> `calldata` en `setPositions` | Predictions | ~20K gas para 100 entries |
| HIGH | Raw `transferFrom` (BUG) | Carton | Fix para USDT/void-returning tokens |
| HIGH | SLOADs en Treasury | Treasury | ~400 gas por `claimPrize` |
| MEDIUM | Cache `treasury`/`activeTournamentId` | Carton | ~200 gas por compra |
| MEDIUM | `immutable` -> `constant` | Predictions | ~40 gas por call, menos bytecode |
| MEDIUM | Loop doble en `submitPrediction` | Predictions | ~7,200 gas para 72 games |
| MEDIUM | Eliminar array `positions` | Predictions | ~2M gas en `setPositions` |
| MEDIUM | `all_different` calldata | Predictions | ~100 gas por `predictWinners` |
| MEDIUM | Custom errors | Todos | 500-1,500 bytes bytecode |
| LOW | `getSupportedAssets` rota | Treasury | ~500 bytes bytecode |
| LOW | PredictionsFactory dead code | - | 20KB del build |
