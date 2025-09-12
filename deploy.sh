#!/bin/bash

# Script de deploy que actualiza automáticamente el .env del frontend

echo "🚀 Deploying contracts to Anvil..."

# Optional TEAMS_HASH (used by Predictions constructor). Example usage:
#   export TEAMS_HASH=0x... && ./deploy.sh
if [ -n "$TEAMS_HASH" ]; then
  echo "🔗 Using TEAMS_HASH: $TEAMS_HASH"
fi

# Ejecutar el deploy script y capturar la salida
DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol --fork-url http://localhost:8545 --broadcast 2>&1)

# Imprimir la salida completa del deploy
echo "$DEPLOY_OUTPUT"

# Extraer las direcciones de los contratos
CARTON_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "Carton deployed at:" | awk '{print $4}')
PREDICTIONS_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "Predictions deployed at:" | awk '{print $4}')
TREASURY_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "Treasury deployed at:" | awk '{print $4}')

# Verificar que se extrajeron las direcciones
if [ -z "$CARTON_ADDRESS" ] || [ -z "$PREDICTIONS_ADDRESS" ] || [ -z "$TREASURY_ADDRESS" ]; then
    echo "❌ Error: No se pudieron extraer las direcciones de los contratos"
    exit 1
fi

echo ""
echo "📝 Updating frontend .env file..."

# Crear el archivo .env con las nuevas direcciones
cat > frontend/.env << EOF
# Contract addresses deployed to Anvil
VITE_CARTON_ADDRESS=$CARTON_ADDRESS
VITE_PREDICTIONS_ADDRESS=$PREDICTIONS_ADDRESS
VITE_TREASURY_ADDRESS=$TREASURY_ADDRESS

# Optional: WalletConnect Project ID (for production)
# VITE_WALLETCONNECT_PROJECT_ID=your_project_id
EOF

echo "✅ Frontend .env file updated successfully!"
echo ""
echo "📋 Updated addresses:"
echo "  Carton:      $CARTON_ADDRESS"
echo "  Predictions: $PREDICTIONS_ADDRESS"
echo "  Treasury:    $TREASURY_ADDRESS"

echo ""
echo "🧩 Exporting fresh ABIs to frontend..."
# Export ABIs as per CLAUDE.md
forge inspect Carton abi --format-json > frontend/src/lib/contracts/carton-abi.json
forge inspect Predictions abi --format-json > frontend/src/lib/contracts/predictions-abi.json
forge inspect Treasury abi --format-json > frontend/src/lib/contracts/treasury-abi.json

if [ $? -eq 0 ]; then
  echo "✅ ABIs exported successfully."
else
  echo "❌ Error exporting ABIs. Ensure 'forge' is available and contracts build successfully."
  exit 1
fi
