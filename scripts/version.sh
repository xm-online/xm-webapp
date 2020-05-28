#!/bin/bash
export majorVersion=$(npm run-script get-version | tail -n 1 | cut -d '.' -f 1)
export minorVersion=$(npm run-script get-version | tail -n 1 | cut -d '.' -f 2)
export patchVersion=$(npm run-script get-version | tail -n 1 | cut -d '.' -f 3)

patchVersion=$((patchVersion - 1))
npm version $majorVersion.$minorVersion.$patchVersion --force --no-git-tag-version
echo "The version was decremented successfully:" $majorVersion.$minorVersion.$patchVersion