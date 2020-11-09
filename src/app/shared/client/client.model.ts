export interface Client {
    id?: any,
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
