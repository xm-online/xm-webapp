#!/bin/bash
version=$(npm --silent run-script get-version)
IFS='.'
read -ra versionArr <<< "$version"

majorVersion=${versionArr[0]}
minorVersion=${versionArr[1]}
patchVersion=${versionArr[2]}

patchVersion=$((patchVersion - 1))
npm --silent version $majorVersion.$minorVersion.$patchVersion --force --no-git-tag-version
echo "The version was decremented successfully:" $majorVersion.$minorVersion.$patchVersion
