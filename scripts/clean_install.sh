# Run these script when you need to clean the project from the auto-generated files and directories and reinstall all dependencies.
#
# Script expects that you run it from the root of the project!
# To run script:
#  - make script executable `chmod 755 ./script/clean_install.sh`
#  - run the script `./scripts/clean_install.sh`
# or use `npm run clean-install` command.

function cleanNestedNodeModules() {
    for dir in */ ; do
      if [ -d "$dir" ]; then
          echo "Search in $dir"
          cd "$dir" || exit
          if [ -d "node_modules" ]; then
              echo "✓ Remove node_modules in $dir."
              rm -rf "node_modules";
          else
              echo "× node_modules in $dir doesn't exist. Proceed to the next one."
          fi
          cd .. || exit
      fi
    done
}

autoGeneratedDirs=(".angular" "node_modules" "lib" "dist" "documentation" "storybook-static")
for index in "${!autoGeneratedDirs[@]}"; do
    if [ -d "${autoGeneratedDirs[index]}" ]; then
        echo "✓ Remove ${autoGeneratedDirs[index]}"
        rm -rf "${autoGeneratedDirs[index]}"
    else
        echo "× ${autoGeneratedDirs[index]} directory doesn't exist. Proceed to the next one."
    fi
done

autoGeneratedFiles=("package-lock.json" "documentation.json")
for index in "${!autoGeneratedFiles[@]}"; do
    if [ -f "${autoGeneratedFiles[index]}" ]; then
        echo "✓ Remove ${autoGeneratedFiles[index]}"
        rm -f "${autoGeneratedFiles[index]}"
    else
        echo "× ${autoGeneratedFiles[index]} file doesn't exist. Proceed to the next one."
    fi
done

printf "\n>>> Change directory ./packages <<< \n"
cd ./packages || exit

cleanNestedNodeModules

printf "\n>>> Change directory ./components <<< \n"
cd ./components || exit

cleanNestedNodeModules

printf "\n>>> Go back to the root of the project <<< \n"
cd ../..

printf "\n>>> Change directory ./src/app/ext <<< \n"
cd ./src/app/ext || exit

cleanNestedNodeModules

printf "\n>>> Go back to the root of the project <<< \n"
cd ../../..

echo "Run npm i"
npm i

echo "Script is finished"
