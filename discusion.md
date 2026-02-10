# Discusión: Partidos on-chain vs off-chain

**Fecha**: February 10, 2026
**Estado**: Pendiente de decisión

---

## Contexto

En `submitPrediction()` (Predictions.sol:229-251), el contrato valida que los pares de equipos enviados por el usuario sean válidos (mismo grupo) y no estén duplicados. Para esto usa una matriz `bool[49][49]` en memoria (2401 slots) que es ineficiente.

Hoy el usuario envía: `gameId + team1 + team2 + result`
El contrato NO tiene los partidos definidos — solo sabe qué equipos pertenecen a qué grupo. Los fixtures (qué equipos juegan en cada gameId) viven solo en el frontend.

## Opción A: Reemplazar la matriz por loop O(n²)

Mantener el diseño actual pero cambiar la estructura de datos.

- **Cambio**: Eliminar `bool[49][49]`, comparar cada predicción contra las anteriores en un loop anidado
- **Pro**: Cambio mínimo, elimina la alocación de 2401 slots, más barato en gas para n pequeño
- **Contra**: No resuelve el problema de fondo — el contrato sigue sin ser fuente de verdad de los fixtures

## Opción B: Guardar los partidos on-chain

El admin define los partidos con algo como `setGames(Game[])` antes de que empiecen las predicciones.

- **Cambio estructural**: El contrato almacena `gameId -> (team1, team2)`. La predicción del usuario se reduce a `gameId + result`.
- **Pros**:
  - La predicción es más liviana (menos calldata por usuario, se multiplica por cada usuario)
  - La validación se simplifica: `¿existe el gameId? ¿ya lo predijiste?` — O(1) con un bool array chico
  - Se elimina: normalización de pares, chequeo de grupos en submit, matriz/loop de duplicados
  - El contrato es fuente de verdad de los fixtures, no solo de los grupos
- **Contras**:
  - Gas del admin para almacenar ~48 partidos (one-time, pero es storage permanente en mainnet)
  - Requiere refactor del struct `Game`, `submitPrediction()`, y los tests
  - El frontend ya funciona con el modelo actual

## Preguntas abiertas

1. ¿Vale la pena el refactor dado que `submitPrediction` ya funciona y está testeado?
2. ¿El ahorro de gas por usuario (menos calldata × N usuarios) justifica el storage del admin?
3. ¿Hay valor en que el contrato sea fuente de verdad de los fixtures más allá del gas?
