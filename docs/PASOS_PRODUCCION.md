# Pasos producción — deploy mainnet + nuevo hosting

## 1. MINTER_ADDRESS — qué es y de dónde sale

**MINTER_ADDRESS** es la wallet **caliente** (hot wallet) que Firebase Functions va a usar para firmar las transacciones de mint cuando alguien paga con Mercado Pago.

No es la misma wallet que hacés el deploy. Son wallets separadas:

| Wallet | Rol | Tipo |
|--------|-----|------|
| Deployer/Admin | Deployar contratos, `grantRole`, `setResult`, retirar fondos | Hardware (Ledger) |
| Minter | Solo firmar `mint()` cuando llega un pago | Hot wallet (private key en Firebase Secrets) |

### Cómo crear MINTER_ADDRESS

Opción A — Generar una wallet nueva con `cast`:
```bash
cast wallet new -j
# Guardá address + private key en un password manager
```

Opción B — Usar una existente que ya tengas (por ej. de MetaMask/Rabby creada aparte).

La private key de esta wallet va a estar cifrada en Firebase Secrets como `PROD_MINTER_WALLET_PRIVATE_KEY`. Necesita tener ~0.005 ETH en Base Mainnet para pagar gas de los mints.

> ⚠️ La MINTER_ADDRESS **no** es una wallet fría. Si la perdés, perdés la capacidad de mintear. Guardala bien.

---

## 2. Deploy contratos mainnet con Ledger

Sí, se puede usar Ledger directamente desde Foundry (Forge). No necesitas Rabby ni otra interfaz.

### Cómo funciona

Forge tiene soporte nativo para Ledger vía el flag `--ledger`. Cuando lo usás:

1. Conectás el Ledger por USB
2. Abrís la app **Ethereum** (o **Ethereum Base** si la tiene — en su defecto Ethereum funciona igual porque Base es EVM compatible)
3. Forge se conecta al Ledger via `hidapi` y le pide firmar la transacción
4. La transacción se envía al RPC desde tu PC, pero la firma nunca sale del Ledger

El Ledger **no necesita** drivers especiales en Linux moderno (va con HID nativo).

### Pasos concretos

```bash
# 1. Conectá el Ledger por USB, abrí la app "Ethereum" o "Base"
#    (tiene que estar en la pantalla "Ethereum ready" o "Base ready")

# 2. Verificá que Forge lo detecta:
forge ledger --list
# Debería mostrar algo como "Ledger Nano X (HID)" con una dirección

# 3. Exportá las vars y ejecutá:
export BASE_MAINNET_RPC_URL=https://mainnet.base.org
export LEDGER=1
export MNEMONIC_INDEX=0
export MINTER_ADDRESS=0x<TU_MINTER_ADDRESS>
./deploy-base-mainnet.sh
```

### MNEMONIC_INDEX

En Ledger Live creás cuentas distintas para cada red (Ethereum, Base, Arbitrum...) desde "Accounts → Add account". Son todas derivaciones de la misma semilla pero con distintos índices.

Para saber qué índice le corresponde a tu cuenta de Base:

```bash
forge ledger --list
# o probá uno por uno
forge ledger --address --mnemonic-index 0
forge ledger --address --mnemonic-index 1
forge ledger --address --mnemonic-index 2
```

El que coincida con la dirección que ves en Ledger Live para Base es el que usás. **No hace falta instalar una app "Base" en el Ledger** — la app Ethereum firmas para cualquier EVM chain.

### Y Rabby / MetaMask?

Rabby y MetaMask son **wallets de navegador** (para interactuar con dApps desde el browser). No se usan para deployar contratos con Forge desde la terminal. Para deployar contratos necesitás:

- **Ledger** (recomendado) — Forge se conecta directo por USB
- **Keystore** de Foundry — guardás la private key cifrada en el disco
- **PRIVATE_KEY** en el entorno — plano (menos seguro, no recomendado para producción)

---

## 3. Crear el nuevo hosting Firebase (para app.prodefi.online)

El hosting de test (firebase hosting default) se queda como está. El nuevo va a ser un subdominio separado.

### Pasos

```bash
# 1. Primero vinculá el dominio en Firebase Console:
#    Firebase Console → Hosting → Agregar dominio personalizado
#    Dominio: app.prodefi.online

# 2. Firebase te va a dar un registro TXT para verificar propiedad.
#    Agregalo en tu DNS (donde manejes prodefi.online).

# 3. Una vez verificado, Firebase te da un registro A o CNAME
#    para apuntar el subdominio. Agregalo en tu DNS.

# 4. Configurá el target de hosting en el proyecto:
firebase target:apply hosting frontend-prod app-prodefi-online --project prodefi
```

El nombre `app-prodefi-online` es el **site ID** de Firebase. Lo crea Firebase automáticamente cuando vinculás el dominio, o podés crearlo manualmente desde Firebase Console → Hosting.

### Después del deploy

```bash
cp frontend/.env.production.example frontend/.env.production.local
# Completá VITE_... reales
pnpm build:hosting:prod
./deploy-frontend-prod.sh
```

---

## Resumen del flujo completo

```
1. Crear MINTER_ADDRESS (wallet hot nueva)
2. Mandarle ~0.005 ETH en Base Mainnet
3. Conectar Ledger, abrir app Ethereum
4. export BASE_MAINNET_RPC_URL LEDGER=1 MNEMONIC_INDEX=0 MINTER_ADDRESS=0x...
5. ./deploy-base-mainnet.sh
6. Guardar addresses resultantes
7. grantRole(MINTER_ROLE, MINTER_ADDRESS)
8. Vincular app.prodefi.online en Firebase
9. Configurar frontend/.env.production.local
10. pnpm build:hosting:prod && ./deploy-frontend-prod.sh
```
