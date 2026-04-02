#!/usr/bin/env sh
set -e

echo "Setting up development environment..."
pnpm install
pnpm run prepare

echo "Running baseline checks..."
pnpm run check

echo "Setup complete. You can now run: pnpm run dev"
