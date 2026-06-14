# ProDefi Landing

Landing estatica en Astro para `prodefi.com`.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

El contenido de la landing se edita en `src/data/landing-content.ts`.
Las reglas se editan en `src/data/rules-content.ts`.

Los CTA principales apuntan a `https://app.prodefi.online`.

## Analytics

La landing carga GA4 directo desde `BaseLayout.astro`.

- `PUBLIC_GA_MEASUREMENT_ID` permite sobreescribir el measurement id
- por defecto queda `G-CVPJ7VDK9E`

## Deploy

La salida estatica se genera en `dist/`.

Pensado para:

- `prodefi.com` -> esta landing
- `app.prodefi.com` -> app React actual en `frontend/`
