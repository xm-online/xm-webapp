const fs = require('fs');
const path = require('path');
const glob = require('glob');
const marked = require('marked');
const dist = './src/docs';
const distStructure = './src/docs/structure.json';
const sources = '{packages,src/app/ext}/**/*.md';

const inputFiles = glob.sync(sources, { ignore: ['**/node_modules/**', '**/README.md'] });
const output = [];
for (const inputFile of inputFiles) {
    console.info(inputFile);
    const name = path.basename(inputFile, '.md');
    const group = inputFile.split('/')[0];
    const outputPath = path.join(dist, inputFile.replace(/.md$/, '.html'));
    const htmlOutput = marked(fs.readFileSync(inputFile, 'utf8'));
    output.push({ name, group, path: outputPath, html: htmlOutput });
}

fs.writeFileSync(path.join(__dirname, '../', distStructure), JSON.stringify(output));
