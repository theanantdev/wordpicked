#!/usr/bin/env sh
set -e

echo "Running project checks..."
echo "- Lint"
pnpm run lint

echo "- Build"
pnpm run build

echo "- Test"
pnpm run test

echo "All checks passed."
