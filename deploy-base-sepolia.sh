#!/bin/bash

set -euo pipefail

RPC_URL="${BASE_SEPOLIA_RPC_URL:-}"
PRIVATE_KEY_VALUE="${PRIVATE_KEY:-}"
FOUNDRY_ACCOUNT_VALUE="${FOUNDRY_ACCOUNT:-}"
PASSWORD_FILE_VALUE="${ETH_PASSWORD:-}"
FRONTEND_ENV_FILE="frontend/.env.openfort.local"
ADMIN_ENV_FILE="admin/.env.local"

if [ -z "$RPC_URL" ]; then
  echo "❌ Missing BASE_SEPOLIA_RPC_URL"
  echo "   Example: export BASE_SEPOLIA_RPC_URL=https://sepolia.base.org"
  exit 1
fi

if [ -z "$PRIVATE_KEY_VALUE" ] && [ -z "$FOUNDRY_ACCOUNT_VALUE" ]; then
  echo "❌ Missing signer configuration"
  echo "   Set PRIVATE_KEY=0x... or FOUNDRY_ACCOUNT=<keystore-account-name> before running this script."
  exit 1
fi

FORGE_WALLET_ARGS=()
CAST_WALLET_ARGS=()
CAST_SEND_SIGNER_ARGS=()

if [ -n "$PRIVATE_KEY_VALUE" ]; then
  DEPLOYER_ADDRESS=$(cast wallet address --private-key "$PRIVATE_KEY_VALUE")
  FORGE_WALLET_ARGS=(--private-key "$PRIVATE_KEY_VALUE")
  CAST_SEND_SIGNER_ARGS=(--private-key "$PRIVATE_KEY_VALUE")
elif [ -n "$FOUNDRY_ACCOUNT_VALUE" ]; then
  if [ -n "$PASSWORD_FILE_VALUE" ]; then
    FORGE_WALLET_ARGS=(--account "$FOUNDRY_ACCOUNT_VALUE" --password-file "$PASSWORD_FILE_VALUE")
    CAST_WALLET_ARGS=(--account "$FOUNDRY_ACCOUNT_VALUE" --password-file "$PASSWORD_FILE_VALUE")
    CAST_SEND_SIGNER_ARGS=(--account "$FOUNDRY_ACCOUNT_VALUE" --password-file "$PASSWORD_FILE_VALUE")
  else
    FORGE_WALLET_ARGS=(--account "$FOUNDRY_ACCOUNT_VALUE")
    CAST_WALLET_ARGS=(--account "$FOUNDRY_ACCOUNT_VALUE")
    CAST_SEND_SIGNER_ARGS=(--account "$FOUNDRY_ACCOUNT_VALUE")
  fi

  DEPLOYER_ADDRESS=$(cast wallet address "${CAST_WALLET_ARGS[@]}")
  export DEPLOYER_ADDRESS
fi

echo "🚀 Deploying contracts to Base Sepolia..."
echo "👤 Using deployer: $DEPLOYER_ADDRESS"

if [ -n "${TEAMS_HASH:-}" ]; then
  echo "🔗 Using TEAMS_HASH: $TEAMS_HASH"
fi

DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol --rpc-url "$RPC_URL" --broadcast "${FORGE_WALLET_ARGS[@]}" 2>&1)

printf '%s\n' "$DEPLOY_OUTPUT"

extract_address() {
  local label="$1"
  printf '%s\n' "$DEPLOY_OUTPUT" | grep "$label" | grep -m1 -Eo '0x[a-fA-F0-9]{40}'
}

CARTON_ADDRESS=$(extract_address "Carton deployed at:")
PREDICTIONS_ADDRESS=$(extract_address "Predictions deployed at:")
TREASURY_ADDRESS=$(extract_address "Treasury deployed at:")
USDC_ADDRESS=$(extract_address "MockUSDC deployed at:")

if [ -z "$CARTON_ADDRESS" ] || [ -z "$PREDICTIONS_ADDRESS" ] || [ -z "$TREASURY_ADDRESS" ] || [ -z "$USDC_ADDRESS" ]; then
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
OPENFORT_PUBLISHABLE_KEY=$(get_existing_value "$FRONTEND_ENV_FILE" "VITE_OPENFORT_PUBLISHABLE_KEY")
OPENFORT_SHIELD_PUBLISHABLE_KEY=$(get_existing_value "$FRONTEND_ENV_FILE" "VITE_OPENFORT_SHIELD_PUBLISHABLE_KEY")

if [ -z "$WALLETCONNECT_PROJECT_ID" ]; then
  WALLETCONNECT_PROJECT_ID="your_walletconnect_project_id"
fi

cat > "$FRONTEND_ENV_FILE" <<EOF
# Base Sepolia Openfort local environment
VITE_CHAIN_ID=84532
VITE_CHAIN_NAME=Base Sepolia
VITE_RPC_URL=$RPC_URL
VITE_CHAIN_CURRENCY_NAME=Ether
VITE_CHAIN_CURRENCY_SYMBOL=ETH
VITE_CHAIN_CURRENCY_DECIMALS=18

VITE_CARTON_ADDRESS=$CARTON_ADDRESS
VITE_PREDICTIONS_ADDRESS=$PREDICTIONS_ADDRESS
VITE_TREASURY_ADDRESS=$TREASURY_ADDRESS
VITE_USDC_ADDRESS=$USDC_ADDRESS

VITE_WALLETCONNECT_PROJECT_ID=$WALLETCONNECT_PROJECT_ID
VITE_OPENFORT_PUBLISHABLE_KEY=$OPENFORT_PUBLISHABLE_KEY
VITE_OPENFORT_SHIELD_PUBLISHABLE_KEY=$OPENFORT_SHIELD_PUBLISHABLE_KEY
EOF

cat > "$ADMIN_ENV_FILE" <<EOF
# Base Sepolia admin local environment
VITE_CHAIN_ID=84532
VITE_CHAIN_NAME=Base Sepolia
VITE_RPC_URL=$RPC_URL
VITE_CHAIN_CURRENCY_NAME=Ether
VITE_CHAIN_CURRENCY_SYMBOL=ETH
VITE_CHAIN_CURRENCY_DECIMALS=18

VITE_CARTON_ADDRESS=$CARTON_ADDRESS
VITE_PREDICTIONS_ADDRESS=$PREDICTIONS_ADDRESS
VITE_TREASURY_ADDRESS=$TREASURY_ADDRESS
VITE_USDC_ADDRESS=$USDC_ADDRESS
EOF

echo "🧩 Exporting fresh ABIs to frontend..."
forge inspect Carton abi --format-json > frontend/src/lib/contracts/carton-abi.json
forge inspect Predictions abi --format-json > frontend/src/lib/contracts/predictions-abi.json
forge inspect Treasury abi --format-json > frontend/src/lib/contracts/treasury-abi.json
forge inspect src/mocks/MockERC20.sol:MockERC20 abi --format-json > frontend/src/lib/contracts/usdc-abi.json

node script/export_frontend_abis.mjs

echo ""
echo "✅ Base Sepolia deploy complete"
echo ""
echo "Contracts:"
echo "  Carton:      $CARTON_ADDRESS"
echo "  Predictions: $PREDICTIONS_ADDRESS"
echo "  Treasury:    $TREASURY_ADDRESS"
echo "  MockUSDC:    $USDC_ADDRESS"
echo ""
echo "Frontend env updated: $FRONTEND_ENV_FILE"
echo "Admin env updated:    $ADMIN_ENV_FILE"
echo ""
echo "Next steps:"
echo "  1. Fill VITE_OPENFORT_PUBLISHABLE_KEY and VITE_OPENFORT_SHIELD_PUBLISHABLE_KEY in $FRONTEND_ENV_FILE"
echo "  2. Fund your test wallets with Base Sepolia ETH"
echo "  3. Mint MockUSDC to a test wallet with:"
echo "     cast send $USDC_ADDRESS \"mint(address,uint256)\" <wallet> 10000000 ${CAST_SEND_SIGNER_ARGS[*]} --rpc-url \"$RPC_URL\""
echo "  4. Start the frontend with: cd frontend && npm run dev:openfort"
echo "  5. Start admin with: cd admin && pnpm dev"
