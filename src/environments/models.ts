export interface IEnvironment {
    production: boolean;
    serverApiUrl: string;
    notFoundUrl: string;
    environment: string | 'local' | 'stg' | 'prod';
    release: string;
    version: string;
    idpServerApiUrl?: string;
    idpClientKey?: string;
}
