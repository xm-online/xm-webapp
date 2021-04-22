import { XmDynamicEntry } from '@xm-ngx/dynamic';

export {
    XmTextTitleOptions,
    XM_TEXT_TITLE_OPTIONS_DEFAULT,
    XmTextTitleComponent,
} from './xm-text-title.component';

export {
    XmTextTitleModule,
} from './xm-text-title.module';

export const XM_TEXT_TITLE_ENTRY: XmDynamicEntry = {
    selector: '@xm-ngx/components/text-title',
    loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextTitleModule),
};
