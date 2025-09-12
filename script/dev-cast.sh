#!/usr/bin/env bash

set -euo pipefail

# Simple Foundry cast playbook for local Anvil
# Usage examples:
#   bash script/dev-cast.sh deadline +3600                    # owner sets deadline now+3600s
#   FROM=0xf39F...2266 bash script/dev-cast.sh predict 2      # submit default prediction for token 2
#   FROM=0xf39F...2266 bash script/dev-cast.sh winners 2 1 2 3 4
#   bash script/dev-cast.sh used 2
#   bash script/dev-cast.sh show-pred 2
#   FROM=0x7099...C8 bash script/dev-cast.sh buy 2            # buy 2 cartons with current price

RPC_URL=${RPC_URL:-http://127.0.0.1:8545}

# Default Anvil accounts (override with FROM or PK)
OWNER_DEFAULT=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
BUYER_DEFAULT=0x70997970C51812dc3A010C7d01b50e0d17dc79C8

die() { echo "❌ $*" >&2; exit 1; }

need() { command -v "$1" >/dev/null 2>&1 || die "Missing dependency: $1"; }

need cast

load_env() {
  if [[ -f frontend/.env ]]; then
    CARTON=$(awk -F= '/VITE_CARTON_ADDRESS/{print $2}' frontend/.env)
    PRED=$(awk -F= '/VITE_PREDICTIONS_ADDRESS/{print $2}' frontend/.env)
    TREASURY=$(awk -F= '/VITE_TREASURY_ADDRESS/{print $2}' frontend/.env)
  else
    die "frontend/.env not found. Run ./deploy.sh first or export CARTON/PRED/TREASURY manually."
  fi
  [[ -n "${CARTON:-}" && -n "${PRED:-}" ]] || die "Contract addresses not found in frontend/.env"
}

sender_flags() {
  if [[ -n "${PK:-}" ]]; then
    echo "--private-key $PK"
  else
    local FROM_ADDR=${FROM:-$OWNER_DEFAULT}
    echo "--from $FROM_ADDR --unlocked"
  fi
}

cmd_deadline() {
  # deadline <+seconds | <unix_timestamp>
  local arg=${1:?"usage: deadline <+seconds|unix_timestamp>"}
  load_env
  local ts
  if [[ "$arg" =~ ^\+?[0-9]+$ ]]; then
    # treat as +seconds from now
    if [[ "$arg" == +* ]]; then
      ts=$(( $(date +%s) + ${arg#+} ))
    else
      # plain seconds treated as absolute timestamp
      ts=$arg
    fi
  else
    die "Invalid time. Use +SECONDS or UNIX_TIMESTAMP"
  fi
  echo "⏱️  Setting submissionDeadline=$ts on $PRED"
  cast send "$PRED" "setSubmissionDeadline(uint256)" "$ts" --rpc-url "$RPC_URL" $(sender_flags)
}

cmd_predict() {
  # predict <tokenId> [prediction_tuple]
  local tokenId=${1:?"usage: predict <tokenId> [tuple]"}
  shift || true
  load_env
  local tuple=${1:-"[(0,1,2,[1,0],false),(1,3,4,[0,0],false),(2,5,6,[2,1],false),(3,7,8,[0,1],false)]"}
  echo "🔮 Submitting prediction for token $tokenId"
  cast send "$PRED" "submitPrediction(uint256,(uint8,uint8,uint8,uint8[2],bool)[])" "$tokenId" "$tuple" --rpc-url "$RPC_URL" $(sender_flags)
}

cmd_winners() {
  # winners <tokenId> w1 w2 w3 w4
  local tokenId=${1:?"usage: winners <tokenId> w1 w2 w3 w4"}
  shift || true
  [[ $# -eq 4 ]] || die "Provide exactly 4 team IDs"
  load_env
  local arr="[$1,$2,$3,$4]"
  echo "🏆 Predicting winners for token $tokenId => $arr"
  cast send "$PRED" "predictWinners(uint256,uint8[4])" "$tokenId" "$arr" --rpc-url "$RPC_URL" $(sender_flags)
}

cmd_used() {
  local tokenId=${1:?"usage: used <tokenId>"}
  load_env
  cast call "$PRED" "used(uint256)(bool)" "$tokenId" --rpc-url "$RPC_URL"
}

cmd_show_pred() {
  local tokenId=${1:?"usage: show-pred <tokenId>"}
  load_env
  cast call "$PRED" "getPrediction(uint256)((uint8,uint8,uint8,uint8[2],bool)[])" "$tokenId" --rpc-url "$RPC_URL"
}

cmd_results() {
  # results <gameId> <g1> <g2>
  local gameId=${1:?"usage: results <gameId> <team1Goals> <team2Goals>"}
  local g1=${2:?}
  local g2=${3:?}
  load_env
  echo "⚽ Setting results for game $gameId => $g1-$g2"
  cast send "$PRED" "setResults(uint8,uint8,uint8)" "$gameId" "$g1" "$g2" --rpc-url "$RPC_URL" $(sender_flags)
}

cmd_points() {
  local tokenId=${1:?"usage: points <tokenId>"}
  load_env
  cast send "$PRED" "updateTotalPoints(uint256)" "$tokenId" --rpc-url "$RPC_URL" $(sender_flags)
}

cmd_position() {
  local tokenId=${1:?"usage: position <tokenId>"}
  load_env
  cast call "$PRED" "getCartonPosition(uint256)(uint256)" "$tokenId" --rpc-url "$RPC_URL"
}

cmd_buy() {
  # buy [count]
  local count=${1:-1}
  load_env
  # Read current price and buy N times with that value
  local price
  price=$(cast call "$CARTON" "cartonPrice()(uint256)" --rpc-url "$RPC_URL")
  echo "🛒 Buying $count carton(s) at price $price wei"
  for ((i=1;i<=count;i++)); do
    cast send "$CARTON" "buyCarton()" --value "$price" --rpc-url "$RPC_URL" $(sender_flags)
  done
}

usage() {
  cat <<EOF
Usage: bash script/dev-cast.sh <command> [args]

Global (env) options:
  RPC_URL     RPC endpoint (default: $RPC_URL)
  FROM        Sender address (uses --unlocked). Default: $OWNER_DEFAULT
  PK          Private key (overrides FROM)

Commands:
  deadline <+seconds|unix>      Set submission deadline
  predict <tokenId> [tuple]     Submit game predictions (tuple default provided)
  winners <tokenId> w1 w2 w3 w4 Predict winners array
  used <tokenId>                Check if token submitted predictions
  show-pred <tokenId>           Read stored prediction
  results <gameId> <g1> <g2>    Set official result
  points <tokenId>              Update total points
  position <tokenId>            Get token position
  buy [count]                   Buy N cartons at current price

Examples:
  FROM=$OWNER_DEFAULT bash script/dev-cast.sh deadline +3600
  FROM=$OWNER_DEFAULT bash script/dev-cast.sh predict 2
  FROM=$OWNER_DEFAULT bash script/dev-cast.sh winners 2 1 2 3 4
  FROM=$BUYER_DEFAULT bash script/dev-cast.sh buy 2
EOF
}

main() {
  local cmd=${1:-help}; shift || true
  case "$cmd" in
    deadline)   cmd_deadline "$@" ;;
    predict)    cmd_predict "$@" ;;
    winners)    cmd_winners "$@" ;;
    used)       cmd_used "$@" ;;
    show-pred)  cmd_show_pred "$@" ;;
    results)    cmd_results "$@" ;;
    points)     cmd_points "$@" ;;
    position)   cmd_position "$@" ;;
    buy)        cmd_buy "$@" ;;
    help|*)     usage ;;
  esac
}

main "$@"

