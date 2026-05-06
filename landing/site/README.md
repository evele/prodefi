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
- `targetDate`
- `primaryPrize`
- `prizeDetails`
- `winnerCount`
- `socialLinks`

## Waitlist

La landing ya tiene el formulario y la validación cliente. Para activarlo de verdad:

1. Por defecto la landing envía a `/api/waitlist`.
2. Si necesitás otro destino, definí `PUBLIC_WAITLIST_ACTION`.
3. El endpoint debe aceptar `POST` JSON con `{ email }`.
4. Si responde `2xx`, el frontend muestra estado de éxito.

Con Firebase Hosting + Functions, `/api/waitlist` queda resuelto con el rewrite de `firebase.json`.

## Deploy

La salida estática se genera en `dist/`.

Pensado para:

- `prodefi.com` -> esta landing
- `app.prodefi.com` -> app React actual en `frontend/`
