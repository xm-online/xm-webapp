const replace = require('replace-in-file');
const buildTimestamp = new Date().getTime();
const options = {
    files: ['src/environments/environment.ts', 'src/environments/environment.prod.ts'],
    from: /buildTimestamp: '\d*'/g,
    to: `buildTimestamp: '${buildTimestamp}'`,
    allowEmptyPaths: false,
};

try {
    replace.sync(options);
    console.info('Build timestamp set: ' + buildTimestamp);
}
catch (error) {
    console.error('Error occurred:', error);
}
