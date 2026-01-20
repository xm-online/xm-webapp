import _ from 'lodash';
import { Command } from './command';
import { Config } from './config';
import { getDirectories, readAsJson, saveAsJson } from './fs-utils';

export class ExtAssetsCommand implements Command {

    public angularConfigAssetsPath: string = 'projects.xm-webapp.architect.build.options.assets';
    public projectConfigAssetsPath: string = 'targets.build.options.assets';
    public extAssetsMask: string = this.config.extDir + '/*/assets';

    constructor(private config: Config) {
    }

    public execute(terminalArgs?: string[]): void {
        const [isNX = false] = terminalArgs || [];
        const {sourceAngularConfig, sourceProjectConfig, targetAngularConfig, targetProjectConfig} = this.config || {};
        const sourceFile: string = isNX === 'true' ? sourceProjectConfig : sourceAngularConfig;
        const targetFile: string = isNX === 'true' ? targetProjectConfig : targetAngularConfig;
        console.info(`Creating ${targetFile}`);

        const config = readAsJson(sourceFile);
        this.updateAngularJsonAssets(config, isNX, targetFile);
        saveAsJson(targetFile, config);
    }

    public updateAngularJsonAssets(config: object, isNX: string | boolean, targetFile: string): void {
        const path: string = isNX === 'true' ? this.projectConfigAssetsPath : this.angularConfigAssetsPath;
        let assets = _.get(config, path, []);
        const extAssets = getDirectories(this.extAssetsMask);

        _.forEach(extAssets, (i) => {
            assets.push({glob: '**/*', input: i, output: '/assets'});
            console.info(`Update ${targetFile} assets:`, i);
        });

        assets = _.uniq(assets);
        _.set(config, path, assets);
    }
}
