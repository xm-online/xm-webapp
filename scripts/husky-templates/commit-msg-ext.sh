#!/bin/sh
. "$(dirname \"$0\")/_/husky.sh"
node ./scripts/validate-commit-msg-ext.js "$1"
