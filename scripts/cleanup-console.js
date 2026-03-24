const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

function getStagedFiles() {
    const output = execSync('git diff --cached --name-only --diff-filter=ACMR', {
        encoding: 'utf-8',
    });

    return output
        .split('\n')
        .map((file) => file.trim())
        .filter(Boolean)
        .filter((file) => /\.(js|jsx|ts|tsx)$/.test(file));
}

function isBlankLine(line) {
    return line.trim() === '';
}

function isStandaloneConsoleLog(line) {
    const trimmed = line.trim();
    // Remove any standalone console.* calls (log, warn, error, info, table, debug, dir, trace, group, groupEnd, etc.)
    return /^console\.(log|warn|error|info|table|debug|dir|trace|group|groupEnd|groupCollapsed|groupEnd|time|timeEnd|timeLog|assert|clear|count|countReset|profile|profileEnd|timeStamp)\s*\(.*\)\s*;?\s*$/.test(trimmed);
}

function cleanupContent(content) {
    const lines = content.split('\n');
    const result = [];
    let previousWasBlank = false;
    for (const line of lines) {
        if (isStandaloneConsoleLog(line)) {
            continue;
        }
        const currentIsBlank = isBlankLine(line);
        if (currentIsBlank) {
            if (previousWasBlank) {
                continue;
            }
            result.push('');
            previousWasBlank = true;
            continue;
        }
        result.push(line);
        previousWasBlank = false;
    }
    while (result.length > 0 && result[0].trim() === '') {
        result.shift();
    }
    while (result.length > 0 && result[result.length - 1].trim() === '') {
        result.pop();
    }
    return result.join('\n') + '\n';
}

function colorize(text, color) {
    const colors = {
        reset: '\x1b[0m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        cyan: '\x1b[36m',
        red: '\x1b[31m',
    };
    return colors[color] + text + colors.reset;
}

function main() {
    const stagedFiles = getStagedFiles();
    if (stagedFiles.length === 0) {
        process.exit(0);
    }
    let changedFilesCount = 0;
    const changedFiles = [];
    for (const file of stagedFiles) {
        if (!fs.existsSync(file)) {
            continue;
        }
        const absolutePath = path.resolve(file);
        const originalContent = fs.readFileSync(absolutePath, 'utf-8');
        const updatedContent = cleanupContent(originalContent);
        if (originalContent !== updatedContent) {
            fs.writeFileSync(absolutePath, updatedContent, 'utf-8');
            execSync(`git add "${file}"`, {stdio: 'inherit'});
            changedFilesCount++;
            changedFiles.push(file);
        }
    }
    if (changedFilesCount > 0) {
        console.info(colorize('[cleanup-console] Updated files:', 'yellow'), colorize(changedFiles.join(', '), 'cyan'));
    } else {
        console.info(colorize('[cleanup-console] No files updated.', 'green'));
    }
}

main();
