# ProDefi Landing

Landing estatica en Astro para `prodefi.com`.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Configuracion rapida

Edita `src/pages/index.astro` para cambiar:

- `appUrl`
- `targetDate`
- `primaryPrize`
- `prizeDetails`
- `winnerCount`
- `socialLinks`

## Waitlist

La landing ya tiene el formulario y la validacion cliente. Para activarlo de verdad:

1. Por defecto la landing envia a `/api/waitlist`.
2. Si necesitas otro destino, defini `PUBLIC_WAITLIST_ACTION`.
3. El endpoint debe aceptar `POST` JSON con `{ email, company, startedAt }`.
4. Si responde `2xx`, el frontend muestra estado de exito.

Protecciones anti-spam implementadas:

- campo honeypot (`company`)
- tiempo minimo de envio (`startedAt`)
- rate limiting server-side por IP hash
- dedupe por email normalizado

Con Firebase Hosting + Functions, `/api/waitlist` queda resuelto con el rewrite de `firebase.json`.

## Analytics

La landing carga GA4 directo desde `BaseLayout.astro`.

- `PUBLIC_GA_MEASUREMENT_ID` permite sobreescribir el measurement id
- por defecto queda `G-CVPJ7VDK9E`

## Deploy

La salida estatica se genera en `dist/`.

Pensado para:

- `prodefi.com` -> esta landing
- `app.prodefi.com` -> app React actual en `frontend/`
