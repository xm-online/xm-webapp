const glob = require('glob');
const path = require('path');
const fs = require('fs');
const sass = require('node-sass');
const packageImporter = require('node-sass-package-importer');
const _ = require('lodash');

const THEMES_PATHS = ['src/styles/prebuild-themes/*.scss', 'src/app/ext/*/styles/prebuild-themes/*.scss'];
const DEST_PATH = 'src/assets/themes';

(() => {
    console.info('Building custom theme scss files.');

    const files = _.flatten(_.map(THEMES_PATHS, (themePath) => glob(themePath, { sync: true })));
    for (const file of files) {
        const name = path.basename(file).match(/^_?([a-zA-Z-]+).scss$/)[1];
        const outFile = `${DEST_PATH}/${name}.css`;

        const res = sass.renderSync({
            file,
            includePaths: ['src', 'src/styles', 'src/app/ext'],
            importer: packageImporter(),
            sourceMap: false,
            outFile: outFile,
            outputStyle: 'compressed',
        });

        fs.writeFileSync(outFile, res.css);

        console.info(`Building: ${outFile}`);
    }

    console.info('Finished building CSS.');
})();
