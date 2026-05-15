# Frontend Environments

El frontend ahora puede correrse con dos modos de Vite sin tocar el codigo:

- `legacy`: desarrollo diario con `Anvil` + wallet EOA + `RainbowKit`
- `openfort`: validacion de `Openfort` en una red soportada

## Scripts

- `npm run dev:legacy`
- `npm run dev:openfort`
- `npm run build:legacy`
- `npm run build:openfort`

`npm run dev` y `npm run build` siguen funcionando como antes usando el modo default de Vite.

## Archivos de entorno por modo

Vite carga estos archivos segun el modo:

- modo default: `.env`, `.env.local`
- modo `legacy`: `.env`, `.env.local`, `.env.legacy`, `.env.legacy.local`
- modo `openfort`: `.env`, `.env.local`, `.env.openfort`, `.env.openfort.local`

Los templates versionados son:

- `.env.example`
- `.env.legacy.example`
- `.env.openfort.example`

Los archivos locales sugeridos para cada flujo son:

- `.env.legacy.local`
- `.env.openfort.local`

`frontend/.gitignore` ya ignora `*.local`, asi que esos archivos quedan fuera del repo.

## Que activa Openfort

El frontend solo activa Openfort si se cumplen ambas condiciones:

- `VITE_OPENFORT_PUBLISHABLE_KEY` y `VITE_OPENFORT_SHIELD_PUBLISHABLE_KEY` tienen valor
- `VITE_CHAIN_ID` pertenece a una red soportada por Openfort

Si alguna de esas condiciones falla, la app vuelve automaticamente al flujo legacy con `RainbowKit`.

## Uso recomendado

- Usar `legacy` para iterar contratos, hacer deploy local y probar con EOA sin depender de testnet
- Usar `openfort` solo cuando haga falta validar login embebido, sponsorship o compatibilidad real con una red soportada

## Nota sobre coexistencia

Aunque el modo `openfort` este activo, el modal de Openfort sigue exponiendo login con wallet externa ademas de email OTP y Google. Eso permite mantener un camino mixto mientras se define si la app queda embedded-first o no.
