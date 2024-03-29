// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { IEnvironment } from './models';

export const environment: IEnvironment = {
    environment: 'default',
    notFoundUrl: '/not-found',
    serverApiUrl: '/xm-api',
    version: 'x.x.x',
    release: 'x.x.x',
    production: false,
};
