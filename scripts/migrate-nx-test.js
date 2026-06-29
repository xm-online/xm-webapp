#!/usr/bin/env node
// One-time migration script: adds per-package test targets + tsconfig.spec.json for nx test
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// All packages that contain *.spec.ts files
const PACKAGES_WITH_SPECS = [
    'account',
    'administration',
    'alert',
    'components',
    'core',
    'dashboard',
    'dynamic',
    'entity',
    'logger',
    'operators',
    'repositories',
    'toaster',
    'translation',
    'validators',
];

const TSCONFIG_SPEC_TEMPLATE = {
    extends: '../../tsconfig.spec.json',
    // Correct relative paths from packages/<name>/ to workspace root
    files: [
        '../../test.ts',
        '../../src/polyfills.ts',
    ],
    // Only include specs belonging to this specific package
    include: ['**/*.spec.ts'],
};

let created = 0;
let updated = 0;

for (const pkg of PACKAGES_WITH_SPECS) {
    const pkgDir = path.join(ROOT, 'packages', pkg);

    if (!fs.existsSync(pkgDir)) {
        console.warn(`[SKIP] packages/${pkg} does not exist`);
        continue;
    }

    // ── 1. Create packages/<pkg>/tsconfig.spec.json ────────────────────────
    const tsconfigPath = path.join(pkgDir, 'tsconfig.spec.json');
    fs.writeFileSync(tsconfigPath, JSON.stringify(TSCONFIG_SPEC_TEMPLATE, null, 2) + '\n');
    created++;
    console.log(`[CREATE] packages/${pkg}/tsconfig.spec.json`);

    // ── 2. Inject "test" target into packages/<pkg>/project.json ───────────
    const projectJsonPath = path.join(pkgDir, 'project.json');
    const projectJson = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));

    if (!projectJson.targets) {
        projectJson.targets = {};
    }

    // Only the package-unique tsConfig path is needed here.
    // executor + main + karmaConfig + polyfills + configurations.ci
    // are all provided by targetDefaults.test in nx.json.
    projectJson.targets.test = {
        options: {
            tsConfig: 'packages/' + pkg + '/tsconfig.spec.json',
        },
    };

    fs.writeFileSync(projectJsonPath, JSON.stringify(projectJson, null, 2) + '\n');
    updated++;
    console.log(`[UPDATE] packages/${pkg}/project.json  (added "test" target)`);
}

console.log('\nDone.');
console.log('  tsconfig.spec.json created:', created);
console.log('  project.json updated:       ', updated);

