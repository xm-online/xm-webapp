const fs = require('fs');
const path = require('path');

const foldersToScan = ['packages', 'src/app/ext'];
const packageJsonFile = 'package.json';
const libFolder = 'lib';

// Function to recursively get all folders with a specific file
function getFoldersWithFile(baseDir, searchFile) {
    const foundFolders = [];

    function scanFolders(dir) {
        const folders = fs.readdirSync(dir, { withFileTypes: true });
        folders.forEach((folder) => {
            const folderPath = path.join(dir, folder.name);

            if (folder.isDirectory()) {
                const filePath = path.join(folderPath, searchFile);
                if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                    foundFolders.push(folderPath);
                } else {
                    scanFolders(folderPath);
                }
            }
        });
    }

    scanFolders(baseDir);

    return foundFolders;
}

// Get all folders with package.json
const foldersWithPackageJson = [];
foldersToScan.forEach((folderPattern) => {
    const matchingFolders = getFoldersWithFile(folderPattern, packageJsonFile);
    foldersWithPackageJson.push(...matchingFolders);
});

// Remove lib directory if it exists
const libFolderPath = path.join(process.cwd(), libFolder);
if (fs.existsSync(libFolderPath)) {
    fs.rmSync(libFolderPath, { recursive: true });
}

// Create lib directory
fs.mkdirSync(libFolderPath);

// Copy package.json to lib folder for each folder
foldersWithPackageJson.forEach((folder) => {
    const packageJsonPath = path.join(folder, packageJsonFile);
    const distPackageJsonPath = path.join(libFolderPath, folder.split('/').pop(), packageJsonFile);

    // Create folder in lib directory if it doesn't exist
    const libFolderInPath = path.dirname(distPackageJsonPath);
    if (!fs.existsSync(libFolderInPath)) {
        fs.mkdirSync(libFolderInPath, { recursive: true });
    }

    // Copy package.json to lib folder
    fs.copyFileSync(packageJsonPath, distPackageJsonPath);

    console.info(`Copied ${packageJsonFile} to ${distPackageJsonPath}`);
});
