import * as fs from 'fs';
import * as glob from 'glob';
import _ from 'lodash';
import * as path from 'path';
import { Command } from './command';
import { ignoreChangedFile } from './git-utils';
import { readAsJson } from './fs-utils';

export class ExtConfigCommand implements Command {

    public extConfigDistPath: string = 'src/app/xm.config.ts';

    public extDirs: string[] = [
        'src/app/ext-commons/*/xm.config.json',
        'src/app/ext/*/xm.config.json',
    ];

    public execute(): void {
        console.info('Start merge ext config.');

        const files: string[] = _.flatten(_.map(this.extDirs, (themePath) => glob.sync(themePath)));
        const extensions = {};
        for (const file of files) {
            const directoryName = path.basename(path.dirname(file));
            extensions[directoryName] = readAsJson(file);
            console.info(`Found file=${file}.`);
        }
        const result = {extensions};
        const resultJson = JSON.stringify(result, null, 4).replace(/"/g,"'");
        const resultStr = `export default ${resultJson};
`;

        fs.writeFileSync(this.extConfigDistPath, resultStr);

        ignoreChangedFile(this.extConfigDistPath);
        console.info('Complete merge ext config.');
    }
}
