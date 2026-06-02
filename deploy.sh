#!/bin/bash

# Script de deploy que actualiza automáticamente el .env del frontend

echo "🚀 Deploying contracts to Anvil..."

upsert_env_value() {
  local file_path="$1"
  local key="$2"
  local value="$3"

  if grep -q "^${key}=" "$file_path"; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$file_path"
  else
    printf '\n%s=%s\n' "$key" "$value" >> "$file_path"
  fi
}

prepare_env_file() {
  local file_path="$1"
  local example_path="$2"

  if [ -f "$file_path" ]; then
    return
  fi

  if [ -f "$example_path" ]; then
    cp "$example_path" "$file_path"
  else
    touch "$file_path"
  fi
}

update_contract_envs() {
  local file_path="$1"
  local example_path="$2"

  prepare_env_file "$file_path" "$example_path"
  upsert_env_value "$file_path" "VITE_CARTON_ADDRESS" "$CARTON_ADDRESS"
  upsert_env_value "$file_path" "VITE_PREDICTIONS_ADDRESS" "$PREDICTIONS_ADDRESS"
  upsert_env_value "$file_path" "VITE_TREASURY_ADDRESS" "$TREASURY_ADDRESS"
  upsert_env_value "$file_path" "VITE_USDC_ADDRESS" "$USDC_ADDRESS"
}

# Optional TEAMS_HASH (used by Predictions constructor). Example usage:
#   export TEAMS_HASH=0x... && ./deploy.sh
if [ -n "$TEAMS_HASH" ]; then
  echo "🔗 Using TEAMS_HASH: $TEAMS_HASH"
fi

if [ -z "${PRIVATE_KEY:-}" ]; then
  export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
fi

# Ejecutar el deploy script y capturar la salida
DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol --fork-url http://localhost:8545 --broadcast 2>&1)
DEPLOY_STATUS=$?

# Imprimir la salida completa del deploy
echo "$DEPLOY_OUTPUT"

if [ $DEPLOY_STATUS -ne 0 ]; then
  echo "❌ Error: forge script failed before contract addresses could be extracted"
  exit $DEPLOY_STATUS
fi

# Extraer las direcciones de los contratos de forma robusta aunque Foundry
# agregue prefijos o cambie levemente el formato de los logs.
extract_address() {
    local label="$1"
    printf '%s\n' "$DEPLOY_OUTPUT" | grep "$label" | grep -m1 -Eo '0x[a-fA-F0-9]{40}'
}

CARTON_ADDRESS=$(extract_address "Carton deployed at:")
PREDICTIONS_ADDRESS=$(extract_address "Predictions deployed at:")
TREASURY_ADDRESS=$(extract_address "Treasury deployed at:")
USDC_ADDRESS=$(extract_address "MockUSDC deployed at:")

# Verificar que se extrajeron las direcciones
if [ -z "$CARTON_ADDRESS" ] || [ -z "$PREDICTIONS_ADDRESS" ] || [ -z "$TREASURY_ADDRESS" ] || [ -z "$USDC_ADDRESS" ]; then
    echo "❌ Error: No se pudieron extraer las direcciones de los contratos"
    exit 1
fi

echo ""
echo "📝 Updating frontend .env file..."

update_contract_envs frontend/.env frontend/.env.example

echo "✅ Frontend .env file updated successfully!"
echo ""
echo "📋 Updated addresses:"
echo "  Carton:      $CARTON_ADDRESS"
echo "  Predictions: $PREDICTIONS_ADDRESS"
echo "  Treasury:    $TREASURY_ADDRESS"
echo "  USDC:        $USDC_ADDRESS"

echo ""
echo "🧩 Exporting fresh ABIs to frontend..."
# Export ABIs as per CLAUDE.md
forge inspect Carton abi --format-json > frontend/src/lib/contracts/carton-abi.json
forge inspect Predictions abi --format-json > frontend/src/lib/contracts/predictions-abi.json
forge inspect Treasury abi --format-json > frontend/src/lib/contracts/treasury-abi.json
# Export MockERC20 ABI directly with forge to avoid jq dependency
forge inspect src/mocks/MockERC20.sol:MockERC20 abi --format-json > frontend/src/lib/contracts/usdc-abi.json

if [ $? -eq 0 ]; then
  echo "✅ ABIs exported successfully."
else
  echo "❌ Error exporting ABIs. Ensure 'forge' is available and contracts build successfully."
  exit 1
fi

echo "🧱 Generating typed ABI exports for frontend..."
node script/export_frontend_abis.mjs

if [ $? -eq 0 ]; then
  echo "✅ Typed ABI exports generated successfully."
else
  echo "❌ Error generating typed ABI exports."
  exit 1
fi

# Crear el archivo .env en el admin con las nuevas direcciones
update_contract_envs admin/.env admin/.env.example

echo "✅ Admin .env file updated successfully!"
echo ""
echo "📋 Updated addresses:"
echo "  Carton:      $CARTON_ADDRESS"
echo "  Predictions: $PREDICTIONS_ADDRESS"
echo "  Treasury:    $TREASURY_ADDRESS"
echo "  USDC:        $USDC_ADDRESS"
