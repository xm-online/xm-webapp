import { Action } from '../types';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

export const actions: Action[] = [
    {
        translateKey: marker('transfer-dashboards.actionTypeStep.transferDashboards'),
        value: 'transfer-dashboards',
    },
    {
        translateKey: marker('transfer-dashboards.actionTypeStep.updateRoles'),
        value: 'update-roles',
    },
];
