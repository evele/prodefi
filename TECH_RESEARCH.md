# Tech Research

Tecnologias y servicios evaluados para el proyecto. Referencia para decisiones futuras.

*Last updated: February 15, 2026*

---

## Account Abstraction / Onboarding

Objetivo: facilitar onboarding de usuarios no-cripto (sin wallet previa).

### Dynamic.xyz

- **URL**: https://www.dynamic.xyz/pricing
- **Que hace**: Multi-chain auth, social login, embedded wallets, on/off-ramps
- **Free (Launch)**: 1,000 MAUs, embedded wallets, social login, multi-chain auth
- **Growth ($249/mo)**: 5,000 MAUs (+$0.05/MAU extra), smart wallets (ERC-4337 & EIP-7702), fraud protection, MFA avanzado
- **Enterprise**: Custom pricing, 10,000+ MAUs, white-labeling, SSO/Okta, SLAs
- **Nota**: Account abstraction (4337/7702) recien desde Growth tier. Free tier tiene embedded wallets basicas.

### Para (getpara.com)

- **URL**: https://www.getpara.com/pricing
- **Que hace**: MPC embedded wallets, passkeys, wallet recovery, multi-chain
- **Free**: 1,200 MAUs, features core
- **Starter ($200/mo)**: 2,500 MAUs (+$0.06/MAU extra), whitelabeling, MPC wallets, passkeys, phone auth, RainbowKit plugin
- **Growth ($500/mo)**: 10,000 MAUs (+$0.05/MAU extra), analytics
- **Scale ($1,000/mo)**: 25,000 MAUs, transaction simulation, integration support
- **Nota**: Usa MPC distribuido (private key nunca en un solo lugar). Soporta EVM, Solana, Cosmos. RainbowKit plugin = integracion directa con nuestro stack.

### Comparacion rapida

| | Dynamic | Para |
|---|---|---|
| Free MAUs | 1,000 | 1,200 |
| Primer tier pago | $249/mo (5k MAUs) | $200/mo (2.5k MAUs) |
| Costo MAU extra | $0.05 | $0.06 (starter) / $0.05 (growth) |
| AA/Smart wallets | Desde Growth ($249) | MPC wallets desde Starter ($200) |
| RainbowKit compat | Si | Si (plugin nativo) |
| Passkeys | ? | Si (nativo) |
| Enfoque | Auth + wallets + onramps | MPC security + embedded wallets |

### Decision pendiente

- Evaluar cual se integra mejor con Wagmi + RainbowKit (stack actual)
- Testear free tiers de ambos
- Definir si el target audience necesita esto (ver seccion "Validation & Traction" en DEVELOPMENT_PLAN.md)

---

## Mini Apps — Distribución en plataformas existentes

Objetivo: resolver distribución y onboarding desplegando ProDefi como mini app dentro de plataformas con audiencia propia.

### Lemon Cash

- **URL**: https://lemon.me/miniapps
- **Docs**: https://lemoncash.mintlify.app/quickstart/quickstart
- **SDK**: `@lemoncash/mini-app-sdk`
- **Que hace**: Web app que corre dentro del WebView de la app de Lemon Cash
- **Auth**: `authenticate()` devuelve wallet address del usuario — sin MetaMask ni RainbowKit
- **Pagos**: `deposit()` nativo para USDC
- **Chain**: Polygon (requiere redeploy de contratos)
- **Audiencia**: Millones de usuarios LatAm con USDC disponible — público general, no cripto-nativo
- **Fit con ProDefi**: Alto — compra de carton con USDC ya implementada, solo cambia el canal de auth y pago

### Farcaster Mini Apps

- **Cliente principal**: Warpcast
- **SDK**: `@farcaster/frame-sdk`
- **Que hace**: Web apps que corren dentro de Warpcast (antes llamadas "Frames")
- **Auth**: SDK provee FID (Farcaster ID) + wallet EVM nativa del usuario
- **Chain**: EVM compatible — sin cambios en contratos actuales
- **Audiencia**: 100% cripto-nativa, ya tienen wallets
- **Fit con ProDefi**: Muy alto — casi plug-and-play con el stack actual

### Beexo

- A investigar — explorar ecosistema y SDK disponible

### Consideraciones generales

- El frontend React/Vite es reutilizable en todos los casos
- Lemon requiere deploy en Polygon; Farcaster es compatible con EVM actual
- Cada plataforma resuelve distribución + identidad + wallet en un solo paso
- Ver decisión estratégica en DEVELOPMENT_PLAN.md → "Opción: Mini Apps como canal de distribución"

---

## (Agregar mas categorias aca segun se investiguen)
