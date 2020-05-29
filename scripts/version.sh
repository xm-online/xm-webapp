#!/bin/bash
export version=$(npm --silent run-script get-version)
IFS='.'
read -ra versionArr <<< "$version"

export majorVersion=${versionArr[0]}
export minorVersion=${versionArr[1]}
export patchVersion=${versionArr[2]}

patchVersion=$((patchVersion - 1))
npm --silent version $majorVersion.$minorVersion.$patchVersion --force --no-git-tag-version
echo "The version was decremented successfully:" $majorVersion.$minorVersion.$patchVersion
