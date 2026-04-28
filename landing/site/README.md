# ProDefi Landing

Landing estática en Astro para `prodefi.com`.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Configuración rápida

Editá `src/pages/index.astro` para cambiar:

- `appUrl`
- `waitlistAction`
- `waitlistCount`
- `targetDate`
- `primaryPrize`
- `prizeDetails`
- `winnerCount`
- `socialLinks`

## Waitlist

La landing ya tiene el formulario y la validación cliente. Para activarlo de verdad:

1. Definí `waitlistAction` en `src/pages/index.astro`.
2. El endpoint debe aceptar `POST` JSON con `{ email }`.
3. Si responde `2xx`, el frontend muestra estado de éxito.

Mientras `waitlistAction` esté vacío, la landing queda en modo wiring y no envía datos.

## Deploy

La salida estática se genera en `dist/`.

Pensado para:

- `prodefi.com` -> esta landing
- `app.prodefi.com` -> app React actual en `frontend/`
