import * as npmPackage from '.././../package.json';
import { IEnvironment } from './models';

export const environment: IEnvironment = {
    environment: 'prod',
    notFoundUrl: '/accessdenied',
    serverApiUrl: '',
    version: npmPackage.version,
    release: npmPackage.release,
    production: true,
};
