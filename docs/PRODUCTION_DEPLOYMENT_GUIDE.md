# ProDefi — Guía de salida a producción

Esta guía cubre el camino completo desde el estado actual (todo en testnet/sandbox, frontend sin deploy) hasta producción real, integrando los cuatro sistemas:

1. **Smart contracts** (Base Sepolia → Base Mainnet)
2. **Mercado Pago** (credenciales de prueba + vendedor de prueba → credenciales productivas reales)
3. **Firebase Functions** (`createOrder`, `mercadoPagoWebhook`, `mintCarton*`) en modo `mainnet`
4. **Openfort** (sandbox → live)
5. **Frontend** (Vite local + Cloudflare tunnel → hosting con dominio propio)

Los pasos están ordenados en la secuencia recomendada. Cada bloque deja un checkpoint verificable antes de pasar al siguiente.

---

## 0. Pre-requisitos

Antes de empezar, asegurate de tener:

- [ ] Una cuenta de Mercado Pago **real** (la que va a recibir los pagos) verificada y con identidad confirmada.
- [ ] Una billetera EVM dedicada al rol de **minter productivo** (privada y separada de la del deployer). Con ETH suficiente en Base Mainnet (~0.005 ETH alcanza para muchos mints).
- [ ] Una billetera EVM dedicada al **deployer de contratos** en Base Mainnet, con ETH suficiente para el deploy.
- [ ] Una cuenta de Openfort con plan activo y proyecto creado.
- [ ] Acceso a Firebase project `prodefi-f2237` con permisos de owner.
- [ ] Un dominio propio (ej. `prodefi.app`) apuntado a tu host de frontend (Firebase Hosting, Vercel, Netlify, Cloudflare Pages, etc.).
- [ ] Certificado SSL válido en ese dominio (obligatorio para producción de MP).

---

## 1. Smart contracts a Base Mainnet

> Objetivo: tener `Carton` y demás contratos deployados en Base Mainnet, con el rol de minter correctamente configurado.

### 1.1. Verificar tests verdes

```bash
cd contracts
forge test
```

Los 119 tests deben pasar. Si alguno falla, no avances.

### 1.2. Configurar `.env` de mainnet en `contracts/`

```env
BASE_MAINNET_RPC_URL=https://mainnet.base.org
DEPLOYER_PRIVATE_KEY=0x...     # wallet que paga el deploy
MINTER_ADDRESS=0x...           # address de la wallet minter productiva (NO la del deployer)
BASESCAN_API_KEY=...           # para verificar contratos
```

### 1.3. Deploy a Base Mainnet

Adaptá el script existente de deploy de Sepolia a mainnet (chain id `8453`). Algo del estilo:

```bash
forge script script/Deploy.s.sol \
  --rpc-url $BASE_MAINNET_RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --broadcast \
  --verify
```

Guardá las **addresses resultantes** (Carton, Predictions, etc.) y el `txHash` de deploy.

### 1.4. Otorgar `MINTER_ROLE` a la minter wallet

Desde la wallet admin (deployer), llamá `grantRole(MINTER_ROLE, MINTER_ADDRESS)` en el contrato `Carton`. Esto es **crítico**: si no, el webhook va a fallar con `AccessControl: account ... is missing role`.

### 1.5. Checkpoint

- [ ] Carton verificado en Basescan
- [ ] La wallet `MINTER_ADDRESS` tiene `MINTER_ROLE` en el Carton de mainnet
- [ ] Anotar `CARTON_ADDRESS_MAINNET` para el paso 3

---

## 2. Mercado Pago — pasaje a credenciales productivas

> Objetivo: dejar de usar la app del vendedor-de-prueba y empezar a usar la app real de tu cuenta productiva.

### 2.1. Crear (o reusar) la app productiva

Logueate con tu **cuenta real** de Mercado Pago en [developers/panel/app](https://www.mercadopago.com.ar/developers/panel/app):

1. Crear una nueva aplicación (o reusar la original `Prodefi`).
2. Tipo: **Pagos online → Checkout Pro**.
3. Verificación de identidad si te la pide.

### 2.2. Activar credenciales productivas

En la app productiva → `Credenciales` → `Productivas` → `Activar credenciales`:

- Industria: la que corresponda
- **Sitio web (obligatorio)**: el dominio HTTPS donde va a vivir el frontend (ej. `https://prodefi.app`)
- Aceptar T&C + reCAPTCHA

Copiá:

- `Access Token` productivo (empieza con `APP_USR-...`)
- `Public Key` productivo
- `Clave secreta de webhooks` productiva (esta la generás en la sección `Webhooks`)

### 2.3. Configurar webhooks productivos

En la misma app → `Webhooks` → `Configurar notificaciones`:

- Modo: **Productivo**
- URL: `https://southamerica-east1-prodefi-f2237.cloudfunctions.net/mercadoPagoWebhook`
- Eventos: `Pagos` (`payment.created`, `payment.updated`)
- Guardar y copiar la **clave secreta** que aparece

### 2.4. Checkpoint

- [ ] `Access Token` productivo guardado (en un password manager, no en git)
- [ ] `Webhook secret` productivo guardado
- [ ] La URL del webhook ya apunta a tu Cloud Function

---

## 3. Firebase Functions — switch a producción

> Objetivo: que `createOrder` use el access token real, que `mercadoPagoWebhook` valide firmas reales, y que el mint se haga en Base Mainnet.

### 3.1. Actualizar secrets

```bash
# Mercado Pago productivo
firebase functions:secrets:set MERCADO_PAGO_ACCESS_TOKEN --project prodefi-f2237
# pegá el APP_USR-... productivo

firebase functions:secrets:set MERCADO_PAGO_WEBHOOK_SECRET --project prodefi-f2237
# pegá la clave secreta de webhooks productiva

# Minter productivo (Base Mainnet)
firebase functions:secrets:set PROD_MINTER_WALLET_PRIVATE_KEY --project prodefi-f2237
# pegá la private key (0x...) de MINTER_ADDRESS

firebase functions:secrets:set PROD_MINTER_RPC_URL --project prodefi-f2237
# pegá el RPC de mainnet — recomendado: Alchemy/Infura/QuickNode pago, no el público

firebase functions:secrets:set PROD_MINTER_ENDPOINT_TOKEN --project prodefi-f2237
# generá un token random largo: openssl rand -hex 32
```

### 3.2. Actualizar params (`functions/.env.prodefi-f2237`)

Reemplazá el contenido por el productivo:

```env
PROD_CARTON_ADDRESS=0x...                    # del paso 1.3
PROD_CHAIN_ID=8453                            # Base Mainnet

MERCADO_PAGO_SUCCESS_URL=https://prodefi.app/checkout/result
MERCADO_PAGO_PENDING_URL=https://prodefi.app/checkout/result
MERCADO_PAGO_FAILURE_URL=https://prodefi.app/checkout/result
MERCADO_PAGO_NOTIFICATION_URL=https://southamerica-east1-prodefi-f2237.cloudfunctions.net/mercadoPagoWebhook

MERCADO_PAGO_MINT_ENVIRONMENT=mainnet

# Dejá los TEST_* solo si querés mantener ambos endpoints disponibles para QA
TEST_CARTON_ADDRESS=0xC4be278Cf2FF8B231e89753e2027d6f51F29C998
TEST_CHAIN_ID=84532
```

> **Importante**: `MERCADO_PAGO_MINT_ENVIRONMENT=mainnet` es lo que hace que el webhook elija `MAINNET_MINT_CONFIG` y dispare el mint en Base Mainnet.

### 3.3. Deploy

```bash
cd functions
npm run lint     # si está configurado
firebase deploy --only functions --project prodefi-f2237
```

### 3.4. Verificar configuración

```bash
firebase functions:secrets:access MERCADO_PAGO_ACCESS_TOKEN --project prodefi-f2237 | head -c 20
# debe empezar con APP_USR-

firebase functions:log --only mercadoPagoWebhook --lines 20 --project prodefi-f2237
# después de hacer un pago, deberías ver logs I de la función ejecutándose
```

### 3.5. Checkpoint

- [ ] `mercadoPagoWebhook` deployado con secrets productivos
- [ ] `mintCartonMainnet` deployado y la wallet del minter tiene MINTER_ROLE
- [ ] `MERCADO_PAGO_MINT_ENVIRONMENT=mainnet`
- [ ] Logs muestran ejecuciones reales (no solo eventos de deploy/audit)

---

## 4. Openfort — switch a live

> Objetivo: que las wallets embebidas sean live y, si usás sponsorship, que las policies estén configuradas para Base Mainnet.

### 4.1. En el dashboard de Openfort

1. Cambiar el proyecto de **Sandbox** a **Live** (o crear un proyecto Live).
2. Generar las claves live:
   - `Publishable key` (live)
   - `Shield publishable key` (live)
3. En `Chains` → habilitar **Base Mainnet** (chain id 8453).
4. Si usás gas sponsorship: crear una **policy** para Base Mainnet y copiar el `pol_...` resultante. Cargá saldo en esa policy.
5. Configurar auth providers (Google OAuth, email OTP, etc.) con los redirect URIs productivos (`https://prodefi.app/auth/callback` o lo que use tu integración).

### 4.2. Checkpoint

- [ ] Proyecto Openfort en modo Live
- [ ] Base Mainnet habilitado
- [ ] Policy de sponsorship con saldo (si aplica)
- [ ] Publishable / Shield keys live anotadas

---

## 5. Frontend — deploy a producción

> Objetivo: dejar de servir el frontend desde Vite local + cloudflare tunnel, y publicarlo en un dominio propio con HTTPS.

### 5.1. Elegir host

Opciones recomendadas:

- **Firebase Hosting** — integración natural con Functions, dominios custom gratis, CDN global
- **Vercel** — DX excelente, deploy automático desde Git
- **Cloudflare Pages** — gratis y rápido

La guía asume Firebase Hosting porque ya estás en el mismo proyecto. Cambiá los comandos si elegís otro.

### 5.2. Configurar env productivo

Creá `frontend/.env.production` (o `.env.openfort.production` si seguís usando el modo openfort):

```env
VITE_CHAIN_ID=8453
VITE_CARTON_ADDRESS=0x...                     # del paso 1.3
VITE_RPC_URL=https://mainnet.base.org         # o tu Alchemy/Infura

VITE_FIREBASE_FUNCTIONS_BASE_URL=https://southamerica-east1-prodefi-f2237.cloudfunctions.net
VITE_MERCADO_PAGO_USE_SANDBOX=false

VITE_OPENFORT_PUBLISHABLE_KEY=pk_live_...
VITE_OPENFORT_SHIELD_PUBLISHABLE_KEY=shpk_live_...
VITE_OPENFORT_ETHEREUM_FEE_SPONSORSHIP_ID=pol_...   # si usás sponsorship

# Remové VITE_WALLETCONNECT_PROJECT_ID a menos que actives wallet auth externa
```

> Nota: `VITE_MERCADO_PAGO_USE_SANDBOX=false` significa que el frontend redirige a `initPoint`, no a `sandboxInitPoint`. En producción siempre `initPoint`.

### 5.3. Quitar el `allowedHosts` de Vite

`vite.config.ts` puede dejar el `.trycloudflare.com` para dev sin problema, pero el build de producción no usa ese setting. Aun así, conviene tener un `.env.example` limpio de variables de tunnel.

### 5.4. Build

```bash
cd frontend
pnpm build:openfort     # o el script que uses para prod
```

Verificá que `dist/` tenga `index.html` y los chunks de Vite.

### 5.5. Deploy a Firebase Hosting

Si todavía no inicializaste hosting:

```bash
firebase init hosting
# - public directory: frontend/dist
# - single-page app: yes
# - GitHub Action: opcional
```

Después:

```bash
firebase deploy --only hosting --project prodefi-f2237
```

Vinculá tu dominio custom desde la consola de Firebase Hosting → "Agregar dominio personalizado". Configurá los registros DNS que te indica (A o CNAME). Esperá a que el SSL se aprovisione (~15-60 min).

### 5.6. Checkpoint

- [ ] `https://prodefi.app` (o tu dominio) carga el frontend con HTTPS
- [ ] La home muestra el botón "Comprar cartón"
- [ ] El modal funciona y conecta wallet (Openfort live)

---

## 6. Smoke test end-to-end en producción

> ⚠️ **Esto cuesta plata real** — vas a hacer un pago real con tarjeta real y mintear un carton onchain.

1. Abrí `https://prodefi.app` con tu cuenta real
2. Conectá una wallet (no la del minter)
3. Click en "Comprar cartón" → "Pagar en pesos"
4. Redirige a Mercado Pago real → pagás con tarjeta real (por ejemplo, vos mismo a vos mismo con $100 si la cuenta lo permite; o pedile a un colega que pague una pequeña suma)
5. Confirmá el pago
6. Volvés a `/checkout/result`
7. Verificá:
   - [ ] Logs de `mercadoPagoWebhook` muestran payment recibido y firma válida
   - [ ] Firestore `orders/{orderId}` pasó por `paid` → `minting` → `fulfilled`
   - [ ] `mintTxHash` está poblado y la tx existe en Basescan
   - [ ] La wallet recibió el carton (ERC-1155 balance del tournamentId)

### Si algo falla

| Síntoma | Diagnóstico |
|---|---|
| MP redirige al `failure_url` | El access token o el webhook secret no son los productivos. Re-chequeá secrets. |
| Webhook devuelve 401 en logs | `MERCADO_PAGO_WEBHOOK_SECRET` no coincide con la app productiva |
| Orden queda en `awaiting_payment_confirmation` para siempre | MP no está llamando al webhook. Chequeá la URL configurada en panel MP → Webhooks |
| Orden pasa a `failed` con `missing role` | La minter wallet no tiene `MINTER_ROLE` en mainnet. Revisá paso 1.4 |
| Orden pasa a `failed` con `insufficient funds` | La minter wallet no tiene ETH en mainnet |
| Orden pasa a `failed` con `unexpected chain id` | `PROD_CHAIN_ID` o el RPC no apuntan a 8453 |

---

## 7. Post-launch

Una vez que el smoke test pase:

- [ ] Activar monitoreo de saldo de la minter wallet (alerta cuando baje de un umbral)
- [ ] Configurar alertas en Cloud Functions para errores 5xx en `mercadoPagoWebhook`
- [ ] Backup periódico de la collection `orders` de Firestore
- [ ] Documentar el procedimiento de retiro de fondos desde la cuenta de MP
- [ ] Definir runbook para "el mint falló pero el pago entró" (refund manual o reintento manual)

---

## 8. Variables y secrets — referencia rápida

### Firebase Functions secrets (`firebase functions:secrets:set ...`)

| Secret | Origen |
|---|---|
| `MERCADO_PAGO_ACCESS_TOKEN` | Panel MP → Credenciales productivas |
| `MERCADO_PAGO_WEBHOOK_SECRET` | Panel MP → Webhooks productivos |
| `PROD_MINTER_WALLET_PRIVATE_KEY` | Wallet minter mainnet (paso 1) |
| `PROD_MINTER_RPC_URL` | Alchemy/Infura/QuickNode mainnet |
| `PROD_MINTER_ENDPOINT_TOKEN` | `openssl rand -hex 32` |
| `TEST_*` | Se pueden conservar para QA paralelo |

### Firebase Functions params (`functions/.env.prodefi-f2237`)

| Param | Valor productivo |
|---|---|
| `PROD_CARTON_ADDRESS` | Carton en Base Mainnet |
| `PROD_CHAIN_ID` | `8453` |
| `MERCADO_PAGO_MINT_ENVIRONMENT` | `mainnet` |
| `MERCADO_PAGO_*_URL` | `https://prodefi.app/checkout/result` |
| `MERCADO_PAGO_NOTIFICATION_URL` | URL pública de `mercadoPagoWebhook` |

### Frontend env (`frontend/.env.production`)

| Var | Valor productivo |
|---|---|
| `VITE_CHAIN_ID` | `8453` |
| `VITE_CARTON_ADDRESS` | Carton en Base Mainnet |
| `VITE_RPC_URL` | RPC público o pago de mainnet |
| `VITE_FIREBASE_FUNCTIONS_BASE_URL` | `https://southamerica-east1-prodefi-f2237.cloudfunctions.net` |
| `VITE_MERCADO_PAGO_USE_SANDBOX` | `false` |
| `VITE_OPENFORT_PUBLISHABLE_KEY` | `pk_live_...` |
| `VITE_OPENFORT_SHIELD_PUBLISHABLE_KEY` | `shpk_live_...` |
| `VITE_OPENFORT_ETHEREUM_FEE_SPONSORSHIP_ID` | `pol_...` (opcional) |

---

## 9. Orden recomendado de ejecución

Para minimizar downtime y riesgos:

1. Deploy de contratos a mainnet + grant MINTER_ROLE (no afecta nada vivo)
2. Activar credenciales productivas en MP (no afecta nada vivo)
3. Subir secrets productivos de Firebase pero **dejar `MERCADO_PAGO_MINT_ENVIRONMENT=testnet`** todavía
4. Build del frontend con env productivo y deploy a hosting
5. Verificar que el frontend carga y conecta wallet OK
6. Recién ahí, cambiar `MERCADO_PAGO_MINT_ENVIRONMENT=mainnet` y redeploy Functions
7. Smoke test end-to-end con monto chico
8. Anuncio público

---

Cualquier paso que no quede claro o falle, vamos uno por uno con logs concretos.
