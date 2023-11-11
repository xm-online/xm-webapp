// TODO: Migrate to bazel or nx or lerna or angular workspace or alternative
const {execSync} = require('child_process');
const fs = require("fs");
const path = require('path');

function findPackageDirectories(rootDirectory) {
    if (!fs.existsSync(rootDirectory)) {
        return [];
    }

    const packageDirs = [];
    const contents = fs.readdirSync(rootDirectory);
    for (const item of contents) {
        const itemPath = path.join(rootDirectory, item);
        if (fs.statSync(itemPath).isDirectory()) {
            const packageJsonPath = path.join(itemPath, 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                packageDirs.push(itemPath);
            }
        }
    }
    return packageDirs;
}

function analyzePackageDependencies(packageDirs) {
    const packageDependencyMap = {};

    for (const packageDir of packageDirs) {
        const packageJsonPath = path.join(path.resolve(), packageDir, 'package.json');
        const packageJson = require(packageJsonPath);
        const dependencies = Object.keys(packageJson.peerDependencies || {});
        const name = packageJson.name;
        packageDependencyMap[name] = {name, dependencies, packageDir}
    }

    return packageDependencyMap;
}

function determineBuildOrder(packageDependencyMap) {
    const buildOrder = [];
    const visited = new Set();

    function findBuildOrder(packageInfo) {

        if (visited.has(packageInfo)) {
            throw 'Recursive dependencies with' + packageInfo + visited;
        }

        visited.add(packageInfo);
        for (const dependency of packageInfo.dependencies) {
            const isOurPackage = !!packageDependencyMap[dependency];
            if (isOurPackage && !buildOrder.includes(dependency)) {
                findBuildOrder(packageDependencyMap[dependency]);
            }
        }
        visited.delete(packageInfo);

        if (!buildOrder.includes(packageInfo)) {
            buildOrder.push(packageInfo);
        }
    }

    for (const packageInfoKey in packageDependencyMap) {
        findBuildOrder(packageDependencyMap[packageInfoKey]);
    }

    return buildOrder;
}

function getPackages(rootDirectories) {
    const packageDirs = rootDirectories.map(rootDirectories => findPackageDirectories(rootDirectories)).flat();
    const packageDependencyMap = analyzePackageDependencies(packageDirs);
    const buildOrder = determineBuildOrder(packageDependencyMap);
    return buildOrder;
}

const build = (packageInfo, partialBuild = false) => {
    const commands = [];

    const packagePath = packageInfo.packageDir;
    const dist = `./lib/${path.basename(packagePath)}`;

    if (partialBuild && fs.existsSync(dist)) {
        return;
    }

    const openDir = `cd ${packagePath}`;
    commands.push(openDir);

    const install = `npm i`;
    commands.push(install);

    const build = `npm run build --if-present`;
    commands.push(build);

    const deep = packagePath.match(/\//g).length;
    const closeDir = `cd ../${'../'.repeat(deep)}`;
    commands.push(closeDir);

    execSync(commands.join(' && '), {stdio: 'inherit'});

    if (fs.existsSync(dist)) {
        const link = `npm i --ignore-scripts ${dist} --save false`;
        execSync(link, {stdio: 'inherit'});
    }
}


function main() {
    const rootDirectories = process.argv.slice(2);
    const partialBuild = process.argv.includes('--partial-build');

    if (!rootDirectories) {
        throw new Error('Invalid arguments: rootDirectories:' + rootDirectories);
    }

    if (!partialBuild) {
        fs.rmSync('./lib', {recursive: true, force: true});
    }

    const packageDirectories = getPackages(rootDirectories);
    for (let packageInfo of packageDirectories) {
        build(packageInfo, partialBuild);
        console.log(`Package added name:${packageInfo.name}.`);
    }
}

main();
