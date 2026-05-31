# Frontend Environments

El frontend ahora puede correrse con dos modos de Vite sin tocar el codigo:

- `legacy`: desarrollo diario con `Anvil` + wallet EOA + `RainbowKit`
- `openfort`: validacion de `Openfort` en una red soportada

## Scripts

- `pnpm dev:legacy`
- `pnpm dev:openfort`
- `pnpm build:legacy`
- `pnpm build:openfort`

`pnpm dev` y `pnpm build` siguen funcionando como antes usando el modo default de Vite.

## Archivos de entorno por modo

Vite carga estos archivos segun el modo:

- modo default: `.env`, `.env.local`
- modo `legacy`: `.env`, `.env.local`, `.env.legacy`, `.env.legacy.local`
- modo `openfort`: `.env`, `.env.local`, `.env.openfort`, `.env.openfort.local`

Los templates versionados son:

- `.env.example`
- `.env.legacy.example`
- `.env.openfort.example`

## Variables nuevas para Firebase / Mercado Pago

Para el checkout ARS via Firebase Functions, define tambien:

- `VITE_FIREBASE_FUNCTIONS_BASE_URL=https://southamerica-east1-<firebase-project>.cloudfunctions.net`
- `VITE_MERCADO_PAGO_USE_SANDBOX=false`

Notas:

- `VITE_FIREBASE_FUNCTIONS_BASE_URL` es la base publica donde viven `createOrder` y `getOrderStatus`
- `VITE_MERCADO_PAGO_USE_SANDBOX` decide si el frontend redirige a `sandboxInitPoint` o a `initPoint`
- por defecto conviene `false` y probar con `initPoint` + credenciales de prueba + buyer test user en una ventana de incógnito

Los archivos locales sugeridos para cada flujo son:

- `.env.legacy.local`
- `.env.openfort.local`

`frontend/.gitignore` ya ignora `*.local`, asi que esos archivos quedan fuera del repo.

## Que activa Openfort

El frontend solo activa Openfort si se cumplen ambas condiciones:

- `VITE_OPENFORT_PUBLISHABLE_KEY` y `VITE_OPENFORT_SHIELD_PUBLISHABLE_KEY` tienen valor
- `VITE_CHAIN_ID` pertenece a una red soportada por Openfort

Si alguna de esas condiciones falla, la app vuelve automaticamente al flujo legacy con `RainbowKit`.

## Sponsorship de gas

Para que las transacciones del wallet embebido pidan gas sponsorship a Openfort, define tambien:

- `VITE_OPENFORT_ETHEREUM_FEE_SPONSORSHIP_ID=pol_...`

Ese valor debe ser el `pol_...` que configuraste en Openfort para la red activa.

Cuando esta variable existe y Openfort esta activo, el frontend:

- adjunta automaticamente el sponsorship ID a las transacciones EVM
- fuerza `accountType` a `DELEGATED_ACCOUNT`, que si soporta gas sponsorship

Si la variable no existe, la app sigue comportandose como hoy: la wallet paga su propio gas y el usuario necesita ETH nativo.

## Wallet auth externa en Openfort

Por defecto, el frontend usa Openfort en modo embedded-only para evitar reconexiones inestables de WalletConnect/relay al recargar.

Si necesitas volver a habilitar login con wallet externa dentro del modal de Openfort, define:

- `VITE_OPENFORT_ENABLE_WALLET_AUTH=true`

Y mantiene tambien un `VITE_WALLETCONNECT_PROJECT_ID` valido.

## Uso recomendado

- Usar `legacy` para iterar contratos, hacer deploy local y probar con EOA sin depender de testnet
- Usar `openfort` solo cuando haga falta validar login embebido, sponsorship o compatibilidad real con una red soportada

## Nota sobre coexistencia

Aunque el modo `openfort` este activo, el modal de Openfort sigue exponiendo login con wallet externa ademas de email OTP y Google. Eso permite mantener un camino mixto mientras se define si la app queda embedded-first o no.
