export interface IEnvironment {
    production: boolean;
    serverApiUrl: string;
    notFoundUrl: string;
    environment: string | 'local' | 'stg' | 'prod' | 'idp';
    release: string;
    version: string;
    idpServerApiUrl?: string;
    idpClientKey?: string;
    idpDevSession?: any; // TODO: temporary solution of 302 idp redirect for local development (should be removed)
}
