#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
node ./scripts/cleanup-console.js
npx lint-staged
