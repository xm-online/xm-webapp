// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import npmPackage from '.././../package.json';
import { IEnvironment } from './models';

export const environment: IEnvironment = {
    environment: 'prod',
    notFoundUrl: '/not-found',
    serverApiUrl: '',
    version: npmPackage.version,
    release: npmPackage.release,
    production: true,
};
