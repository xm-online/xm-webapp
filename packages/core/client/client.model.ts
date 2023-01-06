export enum ClientState {
    'BLOCKED' = 'BLOCKED',
    'ACTIVE' = 'ACTIVE',
    'NONE' = ''
}

export interface Client {
    clientState?: ClientState,
    id?: number,
    clientId?: string,
    clientSecret?: string,
    roleKey?: string,
    description?: string,
    createdBy?: string,
    createdDate?: Date,
    lastModifiedBy?: string,
    lastModifiedDate?: Date,
    accessTokenValiditySeconds?: number,
    scopes?: string[],
}
