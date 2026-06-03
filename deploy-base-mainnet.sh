#!/bin/bash

set -euo pipefail

RPC_URL="${BASE_MAINNET_RPC_URL:-}"
PRIVATE_KEY_VALUE="${PRIVATE_KEY:-}"
FOUNDRY_ACCOUNT_VALUE="${FOUNDRY_ACCOUNT:-}"
PASSWORD_FILE_VALUE="${ETH_PASSWORD:-}"
LEDGER_ENABLED="${LEDGER:-}"
TREZOR_ENABLED="${TREZOR:-}"
MNEMONIC_INDEX_VALUE="${MNEMONIC_INDEX:-0}"
MINTER_ADDRESS_VALUE="${MINTER_ADDRESS:-}"
USDC_ADDRESS_VALUE="${USDC_ADDRESS:-0x833589fCD6EDb6E08f4c7C32D4f71b54bdA02913}"
FRONTEND_ENV_FILE="frontend/.env.production.local"

if [ -z "$RPC_URL" ]; then
  echo "❌ Missing BASE_MAINNET_RPC_URL"
  echo "   Example: export BASE_MAINNET_RPC_URL=https://mainnet.base.org"
  exit 1
fi

if [ -z "$MINTER_ADDRESS_VALUE" ]; then
  echo "❌ Missing MINTER_ADDRESS"
  echo "   Set MINTER_ADDRESS=0x... for the dedicated Firebase minter wallet before running this script."
  exit 1
fi

SIGNER_MODES=0
if [ -n "$PRIVATE_KEY_VALUE" ]; then SIGNER_MODES=$((SIGNER_MODES + 1)); fi
if [ -n "$FOUNDRY_ACCOUNT_VALUE" ]; then SIGNER_MODES=$((SIGNER_MODES + 1)); fi
if [ -n "$LEDGER_ENABLED" ]; then SIGNER_MODES=$((SIGNER_MODES + 1)); fi
if [ -n "$TREZOR_ENABLED" ]; then SIGNER_MODES=$((SIGNER_MODES + 1)); fi

if [ "$SIGNER_MODES" -ne 1 ]; then
  echo "❌ Configure exactly one signer mode"
  echo "   Supported modes: PRIVATE_KEY, FOUNDRY_ACCOUNT, LEDGER=1, TREZOR=1"
  exit 1
fi

FORGE_WALLET_ARGS=()
CAST_WALLET_ARGS=()

if [ -n "$PRIVATE_KEY_VALUE" ]; then
  DEPLOYER_ADDRESS=$(cast wallet address --private-key "$PRIVATE_KEY_VALUE")
  FORGE_WALLET_ARGS=(--private-key "$PRIVATE_KEY_VALUE")
elif [ -n "$FOUNDRY_ACCOUNT_VALUE" ]; then
  if [ -n "$PASSWORD_FILE_VALUE" ]; then
    FORGE_WALLET_ARGS=(--account "$FOUNDRY_ACCOUNT_VALUE" --password-file "$PASSWORD_FILE_VALUE")
    CAST_WALLET_ARGS=(--account "$FOUNDRY_ACCOUNT_VALUE" --password-file "$PASSWORD_FILE_VALUE")
  else
    FORGE_WALLET_ARGS=(--account "$FOUNDRY_ACCOUNT_VALUE")
    CAST_WALLET_ARGS=(--account "$FOUNDRY_ACCOUNT_VALUE")
  fi

  DEPLOYER_ADDRESS=$(cast wallet address "${CAST_WALLET_ARGS[@]}")
elif [ -n "$LEDGER_ENABLED" ]; then
  FORGE_WALLET_ARGS=(--ledger --mnemonic-indexes "$MNEMONIC_INDEX_VALUE")
  CAST_WALLET_ARGS=(--ledger --mnemonic-index "$MNEMONIC_INDEX_VALUE")
  DEPLOYER_ADDRESS=$(cast wallet address "${CAST_WALLET_ARGS[@]}")
elif [ -n "$TREZOR_ENABLED" ]; then
  FORGE_WALLET_ARGS=(--trezor --mnemonic-indexes "$MNEMONIC_INDEX_VALUE")
  CAST_WALLET_ARGS=(--trezor --mnemonic-index "$MNEMONIC_INDEX_VALUE")
  DEPLOYER_ADDRESS=$(cast wallet address "${CAST_WALLET_ARGS[@]}")
fi

export DEPLOYER_ADDRESS
export MINTER_ADDRESS="$MINTER_ADDRESS_VALUE"
export USDC_ADDRESS="$USDC_ADDRESS_VALUE"

echo "🚀 Deploying contracts to Base Mainnet..."
echo "👤 Using deployer: $DEPLOYER_ADDRESS"
echo "🪙 Using USDC: $USDC_ADDRESS"
echo "🖨️  Using minter: $MINTER_ADDRESS"

if [ -n "${TEAMS_HASH:-}" ]; then
  echo "🔗 Using TEAMS_HASH: $TEAMS_HASH"
fi

DEPLOY_OUTPUT=$(forge script script/DeployMainnet.s.sol --rpc-url "$RPC_URL" --broadcast "${FORGE_WALLET_ARGS[@]}" 2>&1)

printf '%s\n' "$DEPLOY_OUTPUT"

extract_address() {
  local label="$1"
  printf '%s\n' "$DEPLOY_OUTPUT" | grep "$label" | grep -m1 -Eo '0x[a-fA-F0-9]{40}'
}

CARTON_ADDRESS=$(extract_address "Carton deployed at:")
PREDICTIONS_ADDRESS=$(extract_address "Predictions deployed at:")
TREASURY_ADDRESS=$(extract_address "Treasury deployed at:")

if [ -z "$CARTON_ADDRESS" ] || [ -z "$PREDICTIONS_ADDRESS" ] || [ -z "$TREASURY_ADDRESS" ]; then
  echo "❌ Error: could not extract one or more deployed addresses"
  exit 1
fi

get_existing_value() {
  local file="$1"
  local key="$2"

  if [ ! -f "$file" ]; then
    return
  fi

  grep -E "^${key}=" "$file" | tail -n1 | cut -d= -f2-
}

WALLETCONNECT_PROJECT_ID=$(get_existing_value "$FRONTEND_ENV_FILE" "VITE_WALLETCONNECT_PROJECT_ID")
OPENFORT_ENABLE_WALLET_AUTH=$(get_existing_value "$FRONTEND_ENV_FILE" "VITE_OPENFORT_ENABLE_WALLET_AUTH")
OPENFORT_PUBLISHABLE_KEY=$(get_existing_value "$FRONTEND_ENV_FILE" "VITE_OPENFORT_PUBLISHABLE_KEY")
OPENFORT_SHIELD_PUBLISHABLE_KEY=$(get_existing_value "$FRONTEND_ENV_FILE" "VITE_OPENFORT_SHIELD_PUBLISHABLE_KEY")
OPENFORT_ETHEREUM_FEE_SPONSORSHIP_ID=$(get_existing_value "$FRONTEND_ENV_FILE" "VITE_OPENFORT_ETHEREUM_FEE_SPONSORSHIP_ID")

if [ -z "$WALLETCONNECT_PROJECT_ID" ]; then
  WALLETCONNECT_PROJECT_ID="your_walletconnect_project_id"
fi

if [ -z "$OPENFORT_ENABLE_WALLET_AUTH" ]; then
  OPENFORT_ENABLE_WALLET_AUTH="true"
fi

cat > "$FRONTEND_ENV_FILE" <<EOF
# Base Mainnet production frontend environment
VITE_CHAIN_ID=8453
VITE_CHAIN_NAME=Base
VITE_RPC_URL=$RPC_URL
VITE_CHAIN_CURRENCY_NAME=Ether
VITE_CHAIN_CURRENCY_SYMBOL=ETH
VITE_CHAIN_CURRENCY_DECIMALS=18

VITE_CARTON_ADDRESS=$CARTON_ADDRESS
VITE_PREDICTIONS_ADDRESS=$PREDICTIONS_ADDRESS
VITE_TREASURY_ADDRESS=$TREASURY_ADDRESS
VITE_USDC_ADDRESS=$USDC_ADDRESS

VITE_WALLETCONNECT_PROJECT_ID=$WALLETCONNECT_PROJECT_ID
VITE_FIREBASE_FUNCTIONS_BASE_URL=https://southamerica-east1-prodefi-f2237.cloudfunctions.net
VITE_MERCADO_PAGO_USE_SANDBOX=false
VITE_OPENFORT_ENABLE_WALLET_AUTH=$OPENFORT_ENABLE_WALLET_AUTH
VITE_OPENFORT_PUBLISHABLE_KEY=$OPENFORT_PUBLISHABLE_KEY
VITE_OPENFORT_SHIELD_PUBLISHABLE_KEY=$OPENFORT_SHIELD_PUBLISHABLE_KEY
VITE_OPENFORT_ETHEREUM_FEE_SPONSORSHIP_ID=$OPENFORT_ETHEREUM_FEE_SPONSORSHIP_ID
EOF

echo "🧩 Exporting fresh ABIs to frontend..."
forge inspect Carton abi --format-json > frontend/src/lib/contracts/carton-abi.json
forge inspect Predictions abi --format-json > frontend/src/lib/contracts/predictions-abi.json
forge inspect Treasury abi --format-json > frontend/src/lib/contracts/treasury-abi.json
forge inspect src/mocks/MockERC20.sol:MockERC20 abi --format-json > frontend/src/lib/contracts/usdc-abi.json

node script/export_frontend_abis.mjs

echo ""
echo "✅ Base Mainnet deploy complete"
echo ""
echo "Contracts:"
echo "  Carton:      $CARTON_ADDRESS"
echo "  Predictions: $PREDICTIONS_ADDRESS"
echo "  Treasury:    $TREASURY_ADDRESS"
echo "  USDC:        $USDC_ADDRESS"
echo ""
echo "Frontend env updated: $FRONTEND_ENV_FILE"
echo ""
echo "Next steps:"
echo "  1. Verify Openfort live keys and optional sponsorship values in $FRONTEND_ENV_FILE"
echo "  2. Set PROD_CARTON_ADDRESS=$CARTON_ADDRESS and PROD_CHAIN_ID=8453 in functions/.env.prodefi-f2237"
echo "  3. Upload PROD_* Firebase secrets for the dedicated minter wallet"
echo "  4. Deploy frontend hosting with: ./deploy-frontend-prod.sh"
echo "  5. Switch MERCADO_PAGO_MINT_ENVIRONMENT=mainnet and redeploy Functions only after frontend is live"
