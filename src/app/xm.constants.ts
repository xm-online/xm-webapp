import { environment } from '@xm-ngx/core/environment';
import { MatDialogConfig } from '@angular/material/dialog';
const _DEBUG_INFO_ENABLED = true;

const _DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded';
const _DEFAULT_AUTH_TOKEN = 'Basic d2ViYXBwOndlYmFwcA==';

const _DEFAULT_LANG = 'en';
const _TERMS_ERROR = 'needAcceptTermsOfConditions';
export const IDP_CLIENT = 'idp_client';


/**
 * System event dictionary
 * `{{XM_REGISTRATION: string; XM_USER_LIST_MODIFICATION: string}}`
 * @internal
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
    XM_LOAD_ENTITY_LIST_WITH_TEMPLATE = 'xmLoadEntityListWithTemplate',
    XM_ENTITY_LIST_SELECTION_CHANGED = 'xmEntityListSelection',
}

export const VERSION = environment.version;
export const DEBUG_INFO_ENABLED = _DEBUG_INFO_ENABLED;

export const DEFAULT_LANG = _DEFAULT_LANG;
export const TERMS_ERROR = _TERMS_ERROR;

export const XM_EVENT_LIST = _XM_EVENT_LIST;

export const DEFAULT_CONTENT_TYPE = _DEFAULT_CONTENT_TYPE;
export const DEFAULT_AUTH_TOKEN = _DEFAULT_AUTH_TOKEN;

/** @deprecated use environment.serverApiUrl or provide it with `@xm-ngx/components/proxy-interceptor` */
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


export const XM_CALENDAR_VIEW = {
    MONTH: 'month',
    WEEK: 'week',
    DAY: 'day',
};

export const DEFAULT_CALENDAR_VIEW = 'month';

export const CALENDAR_VIEW = {
    [XM_CALENDAR_VIEW.MONTH]: DEFAULT_CALENDAR_VIEW,
    [XM_CALENDAR_VIEW.WEEK]: 'agendaWeek',
    [XM_CALENDAR_VIEW.DAY]: 'agendaDay',
};
