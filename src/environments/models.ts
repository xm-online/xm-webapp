export interface IEnvironment {
    production: boolean;
    serverApiUrl: string;
    environment: string | 'local' | 'stg' | 'prod';
    release: string;
    version: string;
}
