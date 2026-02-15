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

## (Agregar mas categorias aca segun se investiguen)
