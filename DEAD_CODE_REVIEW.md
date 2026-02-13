# Dead Code Review — Predictions.sol & Treasury.sol

**Fecha**: February 13, 2026
**Estado**: Pendiente de revisión manual

---

## Predictions.sol

### 1. `picks` mapping (linea 92)

```solidity
mapping(uint256 => uint8[]) public picks;
```

Nunca se escribe ni se lee en ningun lado. Dead code limpio.

### 2. Campos `id`, `team1`, `team2` en struct `Game` (lineas 70-72)

```solidity
struct Game {
    uint8 id;       // nunca se escribe
    uint8 team1;    // nunca se escribe
    uint8 team2;    // nunca se escribe
    uint8[2] result;  // usado en setResults()
    bool set;         // usado en setResults()
}
```

`setResults()` solo escribe `result` y `set`. Los otros 3 campos nunca se populan.

### 3. Modifier `onlyBeforeResults` comentado (lineas 63-67)

Codigo comentado con nota `/* NOTE: check if should use this or not */`. La validacion se hace inline en `submitPrediction()` directamente.

### 4. `MAX_INT` (linea 89)

```solidity
uint256 immutable MAX_INT = 0xfff...;
```

Funciona, pero es redundante con `type(uint256).max` que es el idioma estandar en Solidity.

### 5. Sistema `teamGroup` completo (lineas 14-17, 111-153)

- `mapping(uint8 => uint8) public teamGroup`
- `bytes32 public teamGroupsHash`
- `bool public teamGroupsSet`
- `bool public teamGroupsFrozen`
- `setTeamGroups()` y `freezeTeamGroups()`

Todo esto se setea correctamente y se puede leer, pero **ninguna logica de negocio lo consume**. Ni `submitPrediction` ni `predictWinners` validan contra `teamGroup`. La validacion de teamIds se hace solo por rango (`> 0 && <= MAX_TEAM_ID`).

**Decidir**: eliminar si no se va a usar, o agregar validacion `require(teamGroup[teamId] > 0)` en `predictWinners` para aprovecharlo.

---

## Treasury.sol

### 6. `getSupportedAssets()` (linea 175)

Funcion view declarada pero nunca llamada desde ningun lado (ni contratos, ni tests, ni frontend). Verificar si esta incompleta o simplemente no se usa aun.

---

## Cosas que NO son dead code (verificado)

- `used` mapping — se usa en `submitPrediction` y `updateTotalPoints`
- `TotalGamesUpdated` event — se emite en `setTotalGames()`
- `setPositions` con `_predictionPoints` — puntos no se guardan pero se usan para validar orden descendente
- `cartonContract` en Treasury — se usa en linea 89 para `balanceOf`

---

## Cleanup adicional pendiente (del DEVELOPMENT_PLAN)

- Borrar `PredictionsFactory.sol`
- Borrar `Counter.sol` y `Counter.t.sol`
- Borrar `discusion.md`
