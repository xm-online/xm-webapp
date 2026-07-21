export interface AuthSyncMessage {
    type: string;
    payload?: {
        jwt?: string;
        rememberMe?: boolean;
        id: string
    };
}

export const AUTH_LOGOUT = 'USER-LOGOUT';
