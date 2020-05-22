#!/bin/bash
version=`npm -s run-script get-version`
for v in $(echo -n $version |  awk -F '.' '{printf $0" "$1"."$2" "$1}')
do
    echo $v
    if git tag -l | egrep -q "^v"$v"$"
    then
	echo "del"
        git tag -d "v"$v
    fi
    git tag -a "v"$v -m "add tag v$v"
done
