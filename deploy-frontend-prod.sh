#!/usr/bin/env bash

[ -n "${BASH_VERSION:-}" ] || exec bash "$0" "$@"

set -euo pipefail

# Firebase Hosting uploads can fail with the CLI default concurrency.
export FIREBASE_HOSTING_UPLOAD_CONCURRENCY="${FIREBASE_HOSTING_UPLOAD_CONCURRENCY:-20}"

echo "Using FIREBASE_HOSTING_UPLOAD_CONCURRENCY=$FIREBASE_HOSTING_UPLOAD_CONCURRENCY"
echo "Ensure you already mapped the Firebase hosting target with:"
echo "  firebase target:apply hosting frontend-prod <your-production-site-id> --project prodefi"

firebase deploy --only hosting:frontend-prod --project prodefi "$@"
