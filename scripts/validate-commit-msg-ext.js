const fs = require('fs');


const msgFile = process.argv[2] || process.env.HUSKY_GIT_PARAMS;
const message = fs.readFileSync(msgFile, 'utf-8').trim();

const {execSync} = require('child_process');
const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const [branchDir, branchName] = branch.split('/');
const match = message.match(/^([a-z]+)\(([^)]+)\):/i);
if (!match) {
    printGlobalError();
    process.exit(1);
}
const commitDir = match[1];
const commitBranchName = match[2];

if (commitBranchName !== branchName) {
    console.error(colorize(`[commit-msg] BRANCH_NAME in commit message (${commitBranchName}) must match current branch name (${branchName})`, 'red'));
    process.exit(1);
}
if (commitDir !== branchDir) {
    console.error(colorize(`[commit-msg] DIR in commit message '${commitDir}' must match git directory where branch '${branchDir}'`, 'red'));
    process.exit(1);
}

// type(BRANCH_NAME): Short descr, BRANCH_NAME: [A-Z]{2,}-\d+
const regex = /^(feat|fix|chore|refactor|docs|test|style|build|ci|perf|revert|hotfix|release|migration)\([A-Z]{2,}-\d+\): [A-Z][^\n]+/;

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

function printGlobalError() {
    console.error(colorize('[commit-msg] Invalid commit message format for extension.', 'red'));
    console.error('');
    console.error(colorize('Expected formats:', 'red'));
    console.error(colorize('DIR:', 'red'));
    console.error(colorize('- feat', 'red'));
    console.error(colorize('- fix', 'red'));
    console.error(colorize('- chore', 'red'));
    console.error(colorize('- refactor', 'red'));
    console.error(colorize('- docs', 'red'));
    console.error(colorize('- test', 'red'));
    console.error(colorize('- style', 'red'));
    console.error(colorize('- build', 'red'));
    console.error(colorize('- ci', 'red'));
    console.error(colorize('- perf', 'red'));
    console.error(colorize('- revert', 'red'));
    console.error(colorize('- hotfix', 'red'));
    console.error(colorize('- release', 'red'));
    console.error(colorize('- migration', 'red'));
    console.error('');
    console.error(colorize('BRANCH_NAME:', 'red'));
    console.error(colorize('- make sure branch is your task ticket code', 'red'));
    console.error('');
    console.error(colorize('DESCRIPTION:', 'red'));
    console.error(colorize('- Short description about what you have done', 'red'));
    console.error('');
    console.error(colorize('Example: fix(ABC-123): Short description', 'red'));
}

if (!regex.test(message)) {
    printGlobalError();
    process.exit(1);
} else {
    console.info(colorize('1. Commit message valid <3', 'green'));
}

