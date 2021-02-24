import { MatDialogConfig } from '@angular/material/dialog/dialog-config';
import { version } from '../../package.json';

const _VERSION = version;
const _DEBUG_INFO_ENABLED = true;

const _DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded';
const _DEFAULT_AUTH_TOKEN = 'Basic d2ViYXBwOndlYmFwcA==';

const _DEFAULT_LANG = 'en';
const _TERMS_ERROR = 'needAcceptTermsOfConditions';
export const IDP_CLIENT = 'idp_client';
export const DEV_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVUb2tlblRpbWUiOjE2MTQxNTM1NDYxNjYsInVzZXJfbmFtZSI6ImFuZHJldy5raWtvdEBqZXZlcmEuc29mdHdhcmUiLCJzY29wZSI6WyJvcGVuaWQiXSwicm9sZV9rZXkiOiJST0xFX0FETUlOIiwidXNlcl9rZXkiOiI3OTIwNDc4Yy01ODllLTQ5OTYtODNjZS0xZjQyNGJkNjc0NTYiLCJleHAiOjE2MjUxNTM1NDYsImxvZ2lucyI6W3sidHlwZUtleSI6IkxPR0lOLkVNQUlMIiwic3RhdGVLZXkiOm51bGwsImxvZ2luIjoiYW5kcmV3Lmtpa290QGpldmVyYS5zb2Z0d2FyZSJ9XSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiJjYTdjMDk3OS00ZGE4LTRmY2QtYmZjMy1hN2NhOTNlNDg3ZTYiLCJ0ZW5hbnQiOiJTU1AiLCJjbGllbnRfaWQiOiJ3ZWJhcHAifQ.bYp_TPHitRrR6ckXT0v3a0NBD6n5CWfiYz6e0mmg1FjY3iDNrqo1YJrtxFRf8UyVMyHRd4hFh2qw2GQu0rZjybHR4dvgd9zZJ03F5PQtkFwd-QZOSrP0EjwrgoHlt-BFcpNkXSL6Y6xO03JPcODNDsAdW_OK5RhABO52qRStkKSIupvkVbfAaKXkEdbiYDn3gzJRzjG7zFjnEZa-c4_3uGfqh3EFN3JFyV4koI5bSRohQu11CMnjoKRMhgTSaG2W4xnk-GB-q0WMK6VUNMv2FHw8gFJ0HCyXWfZKVnQY3CCtq-fEOofPSv25G7Go8cupBrIn8hSUZEY6xDGJHYTkXQ';

/**
 * System event dictionary
 * @type {{XM_REGISTRATION: string; XM_USER_LIST_MODIFICATION: string}}
 * @private
 */
enum _XM_EVENT_LIST {
    XM_REGISTRATION = 'xmRegistration',
    XM_SUCCESS_AUTH = 'authenticationSuccess',
    XM_UNAUTHORIZED = 'xm.unauthorized',
    XM_LOGOUT = 'xm.logout',
    XM_CHANGE_LANGUAGE = 'changeLanguage',
    XM_DASHBOARD_LIST_MODIFICATION = 'dashboardListModification',
    XM_USER_LIST_MODIFICATION = 'userListModification',
    XM_FUNCTION_CALL_SUCCESS = 'xm.functionCall.success',
    XM_ENTITY_DETAIL_MODIFICATION = 'xmEntityDetailModification',
    XM_REFRESH_TIMELINE = XM_ENTITY_DETAIL_MODIFICATION,
    XM_ATTACHMENT_LIST_MODIFICATION = 'attachmentListModification',
    XM_ENTITY_LIST_MODIFICATION = 'xmEntityListModification',
}

export const VERSION = _VERSION;
export const DEBUG_INFO_ENABLED = _DEBUG_INFO_ENABLED;

export const DEFAULT_LANG = _DEFAULT_LANG;
export const TERMS_ERROR = _TERMS_ERROR;

export const XM_EVENT_LIST = _XM_EVENT_LIST;

export const DEFAULT_CONTENT_TYPE = _DEFAULT_CONTENT_TYPE;
export const DEFAULT_AUTH_TOKEN = _DEFAULT_AUTH_TOKEN;

/** @deprecated use environment.serverApiUrl or provide it with @xm-ngx/components/proxy-interceptor */
export const SERVER_API_URL = '';

/** Default settings for mat-dialogs */
export const XM_MAT_DIALOG_DEFAULT_OPTIONS: MatDialogConfig = {
    role: 'dialog',
    panelClass: 'xm-mat-dialog',
    hasBackdrop: true,
    backdropClass: '',
    disableClose: true,
    minWidth: '120px',
    minHeight: '50px',
    width: '680px',
    maxWidth: '80vw',
    data: null,
    direction: 'ltr',
    ariaDescribedBy: null,
    ariaLabel: null,
    autoFocus: true,
};
