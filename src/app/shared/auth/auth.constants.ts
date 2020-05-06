import { environment } from '@xm-ngx/core/environment';

export const SUPER_ADMIN = 'SUPER-ADMIN';

export const ACCOUNT_URL = `${environment.serverApiUrl}/uaa/api/account`;
export const ACCOUNT_LOGIN_UPDATE_URL = `${environment.serverApiUrl}/uaa/api/account/logins`;
export const ACCOUNT_TFA_ENABLE_URL = `${environment.serverApiUrl}/uaa/api/account/tfa_enable`;
export const ACCOUNT_TFA_DISABLE_URL = `${environment.serverApiUrl}/uaa/api/account/tfa_disable`;
