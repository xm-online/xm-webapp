import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_ANGULAR_EDITOR_CONTROL_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'xm-angular-editor-control',
        loadChildren: () => import('@xm-ngx/components/angular-editor-control').then(m => m.XmAngularEditorControl),
    },
];
