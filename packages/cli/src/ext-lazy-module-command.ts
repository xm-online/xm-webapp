import * as _ from 'lodash';
import { Command } from './command';
import { Config } from './config';
import { getDirectories, readAsJson, saveAsJson } from './fs-utils';

export class ExtLazyModuleCommand implements Command {

    public angularConfigLazyModulesPath: string = 'projects.xm-webapp.architect.build.options.lazyModules';

    constructor(private config: Config) {
    }

    public execute(): void {
        const config = readAsJson(this.config.sourceAngularConfig);
        this.updateAngularJsonLazyModules(config);
        saveAsJson(this.config.targetAngularConfig, config);
    }

    public updateAngularJsonLazyModules(config: object): void {
        let lazyModules = _.get(config, this.angularConfigLazyModulesPath, []);
        const extDirs = getDirectories(this.config.extMask);

        _.forEach(extDirs, (i) => {
            const dirName = i.slice(i.lastIndexOf('/'), i.length);
            const modulePath = this.config.extDir + `${dirName}/module${dirName}.module`;
            lazyModules.push(modulePath);
            console.info('Update angular.json lazyModules:', modulePath);
        });
        lazyModules = _.uniq(lazyModules);
        _.set(config, this.angularConfigLazyModulesPath, lazyModules);
    }
}
