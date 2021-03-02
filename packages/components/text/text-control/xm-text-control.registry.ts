import { XmDynamicEntry } from '@xm-ngx/dynamic';
import { XmTextControlModule } from './xm-text-control.module';

export const XM_TEXT_CONTROL_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/text-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => XmTextControlModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/text-control` instead */
        selector: '@xm-ngx/components/xm-text-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => XmTextControlModule),
    },
];
