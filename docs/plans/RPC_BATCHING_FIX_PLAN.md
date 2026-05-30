# Plan: corregir 429 RPC + batching + polling en frontend público

## Diagnóstico

| Síntoma | Causa raíz |
|---------|-----------|
| `429 Too Many Requests` en `/fixtures`, `/leaderboard`, `/predictions` | Sin multicall configurado en el frontend → cada `useReadContracts` cae a `eth_call` individuales |
| Posiciones se ven, grupo/fecha no cargan | `/fixtures` tira 144 lecturas por refresh (72 games × 2 calls) contra `https://sepolia.base.org` |
| Admin sí anda mejor | Admin tiene `readContractsWithBatch` con multicall address explícita (`admin/src/lib/wallet.tsx:176-239`), el frontend público no |
| Config opaca | `frontend/.env.openfort.local` y `admin/.env` están en `.gitignore` → no hay visibilidad de qué contratos/red se deployaron |

## Contratos objetivo (Base Sepolia, verificados onchain)

- **Carton**: `0xC4be278Cf2FF8B231e89753e2027d6f51F29C998`
- **Predictions**: `0xd310632bDc38A0422dA80741adA06D913CDd4027`
- **Treasury**: `0x4e09D2fd0156aF50fBf762164aa267318326e3E1`
- **USDC**: `0xd7D7895B9acF093b842Ceed37Ac4763793Dd110C`

Estado onchain verificado: `activeTournamentId=1`, `nextTokenId=16`, `positionsVersion=2`, `getGameResults(1)=[2,5]`.

## Fases

### Fase 1 — Habilitar multicall en el frontend

**Archivos a tocar:**
- `frontend/src/lib/chains.ts` — agregar `contracts: { multicall3: { address: "0xcA11bde05977b3631167028862bE2a173976CA11" } }` a la chain custom.
  Si no alcanza, agregar también `batch: { multicall: { batchSize: 1024 } }` en el transport http.

**Por qué:** es el cambio más chico con el mayor impacto. Todas las `useReadContracts` (FixturesView, leaderboard, predictions) empiezan a batch de verdad sin cambiar una línea de los componentes.

**Validación:** abrir devtools → network → filtrar por `eth_call`. Antes del fix se ven ~144 calls por refresh en `/fixtures`. Después se ven 1-2 calls de `aggregate3`.

---

### Fase 2 — Reducir polling

**Archivos a tocar:**

- `frontend/src/components/FixturesView.tsx:212,223` — cambiar `refetchInterval: 30000` a `refetchInterval: 120_000` (2 min). Los resultados oficiales cambian solo cuando el admin los toca.

- `frontend/src/routes/leaderboard.tsx` — los `refetchInterval: 10000` pesados están en `positionData` (L58), `positionVersionData` (L68), `usedData` (L109), `pointsData` (L140). Estrategia:
  - Mantener polling rápido (10s) solo en `positionsVersion` + `nextTokenId` (2 lecturas chicas).
  - Los arrays (`tokenPositions`, `tokenPositionsVersion`, `used`, `calculateTotalPoints`) refetchear solo cuando cambie `positionsVersion` o `nextTokenId`.

- `frontend/src/routes/predictions.tsx` — similar: `submissionDeadline` y `totalGames` pueden pollear cada 10s. Los reads pesados (scoring, games status) refetchear solo cuando cambie el carton seleccionado o el deadline.

---

### Fase 3 — Portar batching helper del admin (si Fase 1 no alcanza)

- Extraer `readContractsWithBatch` de `admin/src/lib/wallet.tsx:176-239` a un helper compartido o copiarlo al frontend.
- Reemplazar `useReadContracts` directo en `FixturesView` con el helper batch.

**Solo si:** después de Fase 1 el número de `eth_call` sigue siendo alto (improbable con multicall bien configurado).

---

### Fase 4 — Visibilidad de configuración del build

- Agregar un badge/rótulo en el UI (solo en modo test, no producción) con chain ID, host RPC, y primeras addresses de contratos.
- O bien incluir esa info en un log de consola al montar la app, parseando `import.meta.env`.
- A futuro: mover el deploy test a un workflow que lea direcciones desde un archivo versionado en vez de `.env` ignorado.

---

### Fase 5 (operacional) — RPC dedicado

- Cambiar `VITE_RPC_URL` en el deploy test de `https://sepolia.base.org` a un endpoint de Alchemy / QuickNode / Infura (o el que el proyecto ya tenga contratado).
- El 429 baja drásticamente aunque el código no cambie.

---

## Orden de implementación

```
Fase 1 → Fase 2 → Fase 4 → Fase 5
```

Fase 3 es contingente: se saltea si Fase 1 resuelve el batching (lo más probable).

## Validación post-fix

1. Cargar `/fixtures` en el build deployado → DevTools Network: ver 1-2 `aggregate3`, no 144 `eth_call`.
2. Hacer clic en tabs "Por grupo", "Por fecha", "Posiciones" → deben cargar datos sin 429.
3. Cargar `/leaderboard` → debe mostrar posiciones provisionales o finales.
4. Cargar `/predictions` con un carton conectado → debe mostrar predicciones y scoring.
5. `firebase deploy --only hosting:frontend-test` sin errores.
6. Abrir el admin local, verificar que los mismos contratos siguen respondiendo.
