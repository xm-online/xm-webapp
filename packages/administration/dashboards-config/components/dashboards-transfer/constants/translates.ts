import { marker } from '@biesbjerg/ngx-translate-extract-marker';

export const translates = {
    actionTypeStepLabel: marker('transfer-dashboards.steps.actionTypeStepLabel'),
    actionTypeStepTitle: marker('transfer-dashboards.steps.actionTypeStepTitle'),

    environmentStepLabel: marker('transfer-dashboards.steps.environmentStepLabel'),
    environmentTitle: marker('transfer-dashboards.steps.environmentStepTitle'),

    dashboardsStepLabel: marker('transfer-dashboards.steps.dashboardsStepLabel'),
    dashboardsTitle: marker('transfer-dashboards.steps.dashboardsStepTitle'),

    dashboardsConfirmStepLabel: marker('transfer-dashboards.steps.dashboardsConfirmationStepLabel'),
    dashboardsConfirmTitle: marker('transfer-dashboards.steps.dashboardsConfirmationStepTitle'),

    rolesStepLabel: marker('transfer-dashboards.steps.rolesStepLabel'),
    rolesTitle: marker('transfer-dashboards.steps.rolesStepTitle'),

    rolesConfirmationStepLabel: marker('transfer-dashboards.steps.rolesConfirmationStepLabel'),
    rolesConfirmationStepTitle: marker('transfer-dashboards.steps.rolesConfirmationStepTitle'),

    doneStepLabel: marker('transfer-dashboards.steps.doneStepLabel'),

    actionNext: marker('transfer-dashboards.actions.next'),
    actionBack: marker('transfer-dashboards.actions.back'),
    actionTransfer: marker('transfer-dashboards.actions.transfer'),
    actionNextWithoutUpdatingRoles: marker('transfer-dashboards.actions.nextWithoutUpdatingRoles'),
    actionUpdateRoles: marker('transfer-dashboards.actions.updateRoles'),
    actionDoItAgain: marker('transfer-dashboards.actions.doItAgain'),

    envStep: {
        urlLabel: marker('transfer-dashboards.envStep.urlLabel'),
        urlPlaceholder: marker('transfer-dashboards.envStep.urlPlaceholder'),
        tokenLabel: marker('transfer-dashboards.envStep.tokenLabel'),
        tokenPlaceholder: marker('transfer-dashboards.envStep.tokenPlaceholder'),
    },
    dashboardsStep: {
        searchLabel: marker('transfer-dashboards.dashboardsStep.searchLabel'),
        searchPlaceholder: marker('transfer-dashboards.dashboardsStep.searchPlaceholder'),
        selectAllDashboards: marker('transfer-dashboards.dashboardsStep.selectAllDashboards'),
    },
    rolesStep: {
        searchLabel: marker('transfer-dashboards.rolesStep.searchLabel'),
        searchPlaceholder: marker('transfer-dashboards.rolesStep.searchPlaceholder'),
        selectAllRoles: marker('transfer-dashboards.rolesStep.selectAllRoles'),
    },
    doneStep: {
        title: marker('transfer-dashboards.doneStep.title'),
        successTransferredDashboards: marker('transfer-dashboards.doneStep.successTransferredDashboards'),
        successUpdatedRoles: marker('transfer-dashboards.doneStep.successUpdatedRoles'),
        inEnvironment: marker('transfer-dashboards.doneStep.inEnvironment'),
        pleaseNote: marker('transfer-dashboards.doneStep.pleaseNote'),
        errorsOccurredWhileUpdating: marker('transfer-dashboards.doneStep.errorsOccurredWhileUpdating'),
        roles: marker('transfer-dashboards.doneStep.roles'),
        statusCode: marker('transfer-dashboards.doneStep.statusCode'),
        errorDescription: marker('transfer-dashboards.doneStep.errorDescription'),
    },
    errors: {
        atLeastOneDashboardRequired: marker('transfer-dashboards.errors.atLeastOneDashboardRequired'),
        atLeastOneRoleRequired: marker('transfer-dashboards.errors.atLeastOneRoleRequired'),
    },
    successMessages: {
        dashboardSuccessfullyCreated: marker('transfer-dashboards.successMessages.dashboardSuccessfullyCreated'),
        rolesSuccessfullyUpdated: marker('transfer-dashboards.successMessages.rolesSuccessfullyUpdated'),
    },
};
