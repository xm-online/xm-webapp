const fs = require('fs').promises;
const path = require('path');
const foldersToScan = ['packages'];
const packageJsonFile = 'package.json';
const libFolder = 'lib';

async function getFoldersWithFile(baseDir, searchFile) {
    const foundFolders = [];

    async function scanDirectory(currentDir) {
        let entries;
        try {
            entries = await fs.readdir(currentDir, {withFileTypes: true});
        } catch (error) {
            console.error(`Could not read directory: ${currentDir}`, error);
            return;
        }

        const processingPromises = entries.map(async (entry) => {
            const entryPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
                const filePath = path.join(entryPath, searchFile);
                try {
                    await fs.access(filePath);

                    foundFolders.push(entryPath);
                } catch (error) {
                    await scanDirectory(entryPath);
                }
            }
        });

        await Promise.all(processingPromises);
    }

    await scanDirectory(baseDir);
    return foundFolders;
}

async function run() {
    try {

        const scanPromises = foldersToScan.map(folder => getFoldersWithFile(folder, packageJsonFile));

        const nestedFolders = await Promise.all(scanPromises);

        const foldersWithPackageJson = nestedFolders.flat();

        if (foldersWithPackageJson.length === 0) {
            console.log('No package.json files found. Exiting.');
            return;
        }

        const libFolderPath = path.join(process.cwd(), libFolder);

        await fs.rm(libFolderPath, {recursive: true, force: true});

        await fs.mkdir(libFolderPath);

        const copyPromises = foldersWithPackageJson.map(async (folder) => {
            const sourcePath = path.join(folder, packageJsonFile);
            const targetFolder = path.join(libFolderPath, path.basename(folder));
            const destinationPath = path.join(targetFolder, packageJsonFile);

            try {
                await fs.mkdir(targetFolder, {recursive: true});
                await fs.copyFile(sourcePath, destinationPath);
                console.info(`Copied ${sourcePath} -> ${destinationPath}`);
            } catch (copyError) {
                console.error(`Error copying file from ${folder}:`, copyError);
            }
        });
        await Promise.all(copyPromises);

        console.log('\nAll operations completed successfully!');

    } catch (error) {
        console.error('\nA critical error occurred:', error);
    }
}

run();
