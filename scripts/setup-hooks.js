const fs = require('fs');
const path = require('path');

const EXTENSIONS_DIR = path.join(__dirname, '../src/app/ext');
const HUSKY_TEMPLATES_DIR = path.join(__dirname, 'husky-templates');
const PRE_COMMIT_CONTENT_CORE = fs.readFileSync(path.join(HUSKY_TEMPLATES_DIR, 'pre-commit-core.sh'), 'utf8');
const PRE_COMMIT_CONTENT_EXT = fs.readFileSync(path.join(HUSKY_TEMPLATES_DIR, 'pre-commit-ext.sh'), 'utf8');
const COMMIT_MSG_CONTENT_CORE = fs.readFileSync(path.join(HUSKY_TEMPLATES_DIR, 'commit-msg-core.sh'), 'utf8');
const COMMIT_MSG_CONTENT_EXT = fs.readFileSync(path.join(HUSKY_TEMPLATES_DIR, 'commit-msg-ext.sh'), 'utf8');


function ensureHuskyDir(targetDir) {
    const huskyDir = path.join(targetDir, '.husky');
    if (!fs.existsSync(huskyDir)) {
        fs.mkdirSync(huskyDir, {recursive: true});
        // Also create husky _ folder for compatibility
        const underscoreDir = path.join(huskyDir, '_');
        if (!fs.existsSync(underscoreDir)) {
            fs.mkdirSync(underscoreDir, {recursive: true});
        }
    }
    return huskyDir;
}

function writePreCommit(targetDir, isExt = false, extRelPath = '') {
    const huskyDir = ensureHuskyDir(targetDir);
    const preCommitPath = path.join(huskyDir, 'pre-commit');
    let content = isExt ? PRE_COMMIT_CONTE - NT_EXT.replace(/\{\{EXT_PATH\}\}/g, extRelPath) : PRE_COMMIT_CONTENT_CORE;
    fs.writeFileSync(preCommitPath, content, {mode: 0o755});
}

function writeCommitMsg(targetDir, isExt = false, extRelPath = '') {
    const huskyDir = ensureHuskyDir(targetDir);
    const commitMsgPath = path.join(huskyDir, 'commit-msg');
    let content = isExt ? COMMIT_MSG_CONTENT_EXT.replace(/\{\{EXT_PATH\}\}/g, extRelPath) : COMMIT_MSG_CONTENT_CORE;
    fs.writeFileSync(commitMsgPath, content, {mode: 0o755});
}

function ensureExecutable(filePath) {
    if (fs.existsSync(filePath)) {
        fs.chmodSync(filePath, 0o755);
    }
}

// Только для корня
writePreCommit(path.join(__dirname, '..'), false);
writeCommitMsg(path.join(__dirname, '..'), false);
const coreHuskyDir = path.join(__dirname, '../.husky');
const coreCommitMsg = path.join(coreHuskyDir, 'commit-msg');
ensureExecutable(coreCommitMsg);
