export interface IEnvironment {
    production: boolean;
    serverApiUrl: string;
    notFoundUrl: string;
    environment: string | 'local' | 'stg' | 'prod' | 'idp';
    release: string;
    version: string;
    idpServerApiUrl?: string;
    idpClientKey?: string;
}
