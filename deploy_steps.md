Avancé el path productivo.
Qué agregué
- script/DeployMainnet.s.sol
- deploya Carton, Predictions, Treasury
- usa USDC real, no MockUSDC
- configura MINTER_ADDRESS separado
- deploy-base-mainnet.sh
- soporta PRIVATE_KEY, FOUNDRY_ACCOUNT, LEDGER=1, TREZOR=1
- default de USDC Base Mainnet:
- 0x833589fCD6EDb6E08f4c7C32D4f71b54bdA02913
- actualiza frontend/.env.production.local
- deploy-frontend-prod.sh
- deploy de hosting target frontend-prod
- frontend/package.json
- build:hosting:prod
- firebase.json
- nuevo target frontend-prod
- frontend/.env.production.example
- docs/PRODUCTION_DEPLOYMENT_GUIDE.md
- alineada con los scripts nuevos
- frontend/.gitignore
- ignora dist-prod
Checks que sí corrí
- sintaxis shell de scripts nuevos: OK
- JSON de firebase.json y .firebaserc: OK
No corrí
- deploy real
- build real de frontend
- forge build de los scripts nuevos


Comandos siguientes
1. Preparar env productivo del frontend:
cp frontend/.env.production.example frontend/.env.production.local
Después completás en ese archivo:
- VITE_OPENFORT_PUBLISHABLE_KEY
- VITE_OPENFORT_SHIELD_PUBLISHABLE_KEY
- VITE_OPENFORT_ETHEREUM_FEE_SPONSORSHIP_ID si aplica
- VITE_WALLETCONNECT_PROJECT_ID
2. Deploy contratos mainnet con Ledger:
export BASE_MAINNET_RPC_URL=https://mainnet.base.org
export LEDGER=1
export MNEMONIC_INDEX=0
export MINTER_ADDRESS=0x...
./deploy-base-mainnet.sh
Si querés fijar TEAMS_HASH:
export TEAMS_HASH=0x...
./deploy-base-mainnet.sh
3. Asociar target de Firebase al site productivo:
- este paso depende del site id real que tengas/crees en Hosting
firebase target:apply hosting frontend-prod <your-production-site-id> --project prodefi
4. Deploy frontend productivo:
./deploy-frontend-prod.sh
5. Después del deploy de contratos, actualizar Functions params:
- functions/.env.prodefi-f2237
- PROD_CARTON_ADDRESS=<nuevo carton>
- PROD_CHAIN_ID=8453
- mantener MERCADO_PAGO_MINT_ENVIRONMENT=testnet hasta que el frontend productivo ya esté arriba
Importante
Tu worktree ya tenía otros cambios previos, incluyendo:
- functions/src/index.js
No lo toqué ahora en esta tanda productiva.
Si querés, el siguiente paso lo hacemos ultra concreto:
1. me pasás qué vas a usar como MINTER_ADDRESS
2. te doy la secuencia exacta de Firebase secrets/params para producción, sin vueltas.