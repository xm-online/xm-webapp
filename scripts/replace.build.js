const { exec } = require("child_process");
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
catch (error) {environment.ts
    console.error('Error occurred:', error);
}

exec('git update-index --assume-unchanged src/environments/environment.ts')
exec('git update-index --assume-unchanged src/environments/environment.prod.ts')
