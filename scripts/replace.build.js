var replace = require('replace-in-file');
var buildTimestamp = new Date().getTime();
const options = {
    files: ['src/environments/environment.ts', 'src/environments/environment.prod.ts'],
    from: /buildTimestamp: '\d*'/g,
    to: 'buildTimestamp: ' + buildTimestamp,
    allowEmptyPaths: false,
};

try {
    let changedFiles = replace.sync(options);
    console.log('Build timestamp set: ' + buildTimestamp);
}
catch (error) {
    console.error('Error occurred:', error);
}
