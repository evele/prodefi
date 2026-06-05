# Fix ESLint Warnings — 24 issues (3 errors, 21 warnings)

## Context
`pnpm run lint` en el frontend devolvió 3 errores de tipo `any` y 21 warnings de dependencias inestables en `useMemo`. Hay que limpiar todo sin cambiar comportamiento.

---

## Fix 1 — `any` en `useAppRead.ts` (líneas 44 y 81)

Las dos funciones declaran `): any` como return type. Cambiar a `ReturnType<typeof useReadContract>` importado de wagmi (ya está importado como `useReadContract as useWagmiReadContract`).

```ts
// antes
export function useAppReadContract(parameters: ReadContractParameters): any {
export function useAppReadContracts(parameters: ReadContractsParameters): any {

// después
export function useAppReadContract(parameters: ReadContractParameters): ReturnType<typeof useWagmiReadContract> {
export function useAppReadContracts(parameters: ReadContractsParameters): ReturnType<typeof useWagmiReadContracts> {
```

---

## Fix 2 — `any` en `providers.tsx` (línea 59)

`as any` en el config de Openfort UI. Chequear qué tipo exporta `@openfort-xyz/openfort-react` para el config (probablemente `OpenfortUIConfig` o similar). Si no está exportado, reemplazar con `as Parameters<typeof OpenfortProvider>[0]` usando el tipo del componente ya importado.

---

## Fix 3 — patrón `useStableValue(...) ?? []` (index.tsx y leaderboard.tsx)

**Problema:** `const X = useStableValue(liveX, ...) ?? []` crea un nuevo `[]` en cada render cuando `liveX` es undefined, haciendo que `X` sea inestable como dependencia de otros `useMemo`.

**Fix:** Separar en dos pasos — hook call + `useMemo` para el fallback:

```ts
// antes (una línea)
const finalPrizeEntries = useStableValue(liveFinalPrizeEntries, liveFinalPrizeEntries !== undefined) ?? []

// después (dos líneas)
const stableFinalPrizeEntries = useStableValue(liveFinalPrizeEntries, liveFinalPrizeEntries !== undefined)
const finalPrizeEntries = useMemo(() => stableFinalPrizeEntries ?? [], [stableFinalPrizeEntries])
```

**Variables a corregir con este patrón:**

`index.tsx`:
- `finalPrizeEntries` (línea 347) → afecta useMemo en líneas 359 y 432

`leaderboard.tsx`:
- `positionsArray` (línea 171) → afecta 5 useMemos
- `usedTokenIds` (línea 204) → afecta 4 useMemos
- `pointsByTokenId` (línea 251) → afecta 4 useMemos — fallback es `new Map<string, bigint>()` en vez de `[]`
- `usdcPrizesByTokenId` (línea 307) → afecta 2 useMemos — idem Map
- `finalLeaderboardRows` (línea 330) → afecta 1 useMemo
- `provisionalLeaderboardRows` (línea 357) → afecta 1 useMemo

---

## Fix 4 — `submittedScoredGameEntries` en `predictions.tsx` (línea 470)

Array construido imperativamente fuera de `useMemo`, lo que lo hace inestable:

```ts
// antes
const submittedScoredGameEntries: SubmittedScoredGameEntry[] = []
normalizedSubmittedGames.forEach((entry, index) => {
  const officialGame = normalizeOfficialGameMeta(submittedOfficialGamesData?.[index]?.result)
  if (!officialGame?.set) return
  submittedScoredGameEntries.push({ gameId: entry.gameId, predictionIndex: index, officialGame })
})

// después
const submittedScoredGameEntries = useMemo(() => {
  const entries: SubmittedScoredGameEntry[] = []
  normalizedSubmittedGames.forEach((entry, index) => {
    const officialGame = normalizeOfficialGameMeta(submittedOfficialGamesData?.[index]?.result)
    if (!officialGame?.set) return
    entries.push({ gameId: entry.gameId, predictionIndex: index, officialGame })
  })
  return entries
}, [normalizedSubmittedGames, submittedOfficialGamesData])
```

---

## Verificación

```bash
cd frontend && pnpm run lint   # debe dar 0 errores y 0 warnings
pnpm run build                 # no debe romper nada
```
