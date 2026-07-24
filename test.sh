#!/bin/bash
export NVM_DIR=~/.nvm
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 24

echo "== tsc --noEmit"
npx tsc --noEmit || { echo "TYPECHECK FAILED"; exit 1; }

for f in tests/unit/*.test.ts tests/integration/*.test.ts; do echo "== $f"; node "$f" || { echo "FAILED: $f"; break; }; done