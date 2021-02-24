export interface IIdpConfig {
    idp?: {
        enabled?: boolean;
        devClientKey?: string;
        clients?: IIdpClient[];
        features?: {
            directLogin?: {
                enabled?: boolean;
                defaultClientKey?: string;
            };
        }
    }
}

export interface IIdpClient {
    clientId?: string;
    devApiUri?: string;
    features?: unknown;
    key: string;
    name?: string;
    icon?: {
        class?: string;
        name?: string;
        src?: string;
        style?: string;
    }
    openIdConfig: IOpenIdConfig;
    redirectUri: string;
}

export interface IOpenIdConfig {
    authorizationEndpoint: {
        uri: string;
    };
    responseType?: string;
    additionalParams?: unknown;
    features?: unknown;
    endSessionEndpoint: {
        uri: string;
    };
    issuer?: string;
}
