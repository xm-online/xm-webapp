/**
 * System event dictionary
 * `{{XM_REGISTRATION: string; XM_USER_LIST_MODIFICATION: string}}`
 * @internal
 */
export enum XM_ENTITY_EVENT_LIST {
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
