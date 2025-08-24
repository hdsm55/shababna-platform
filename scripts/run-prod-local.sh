#!/usr/bin/env bash
set -euo pipefail

export NODE_ENV=production

echo "Building client..."
npm --prefix ./client ci || npm --prefix ./client install
npm --prefix ./client run build

echo "Starting server..."
PORT=${PORT:-5000} HOST=${HOST:-0.0.0.0} node server/index.js
