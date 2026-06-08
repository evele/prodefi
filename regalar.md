# Regalar Carton

Pendientes para dejar habilitado el flujo de `Regalar cartón`:

## Firebase Functions

Configurar estas credenciales de Openfort:

- `OPENFORT_API_KEY` (secret)
- `OPENFORT_PUBLISHABLE_KEY` (param/string)

Sin eso, los endpoints nuevos devuelven `openfort-config-invalid`.

## Endpoints Nuevos

Ya quedaron implementados en `functions/src/index.js`:

- `upsertOpenfortProfile`
- `resolveGiftRecipientByWallet`

Ambos requieren:

- `Authorization: Bearer <openfort access token>`

## Deploy

Después de configurar Openfort en Firebase:

1. desplegar `functions`
2. desplegar frontend si corresponde

## Smoke Test Manual

1. Iniciar sesión con Openfort.
2. Confirmar que el perfil se sincroniza en `userProfiles`.
3. Intentar regalar a una wallet no registrada.
   Resultado esperado: bloqueo con mensaje de wallet no activa en ProDefi.
4. Intentar regalar a la propia wallet.
   Resultado esperado: bloqueo.
5. Regalar a una wallet registrada de otro usuario ProDefi.
   Resultado esperado: verificación exitosa + `safeTransferFrom` confirmado.
6. Confirmar que el cartón desaparece de la home del emisor tras refetch.
7. Confirmar que el receptor lo ve al entrar con su sesión.

## Nota

Hay un cambio local aparte en `frontend/src/routes/predictions.tsx` que no forma parte de este flujo.
