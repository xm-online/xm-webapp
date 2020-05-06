export interface IEnvironment {
    production: boolean;
    environment: string | 'local' | 'stg' | 'prod';
    release: string;
    serverApiUrl: string;
    version: string;
}
