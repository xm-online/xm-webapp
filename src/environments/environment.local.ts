import * as npmPackage from '.././../package.json';
import { IEnvironment } from './models';

export const environment: IEnvironment = {
    environment: 'local',
    notFoundUrl: '/accessdenied',
    serverApiUrl: '/xm-api',
    version: npmPackage.version,
    release: npmPackage.release,
    production: false,
};
