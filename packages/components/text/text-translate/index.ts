import { XmDynamicEntry } from '@xm-ngx/dynamic';

export {
    XmTextTranslateComponent,
} from './xm-text-translate.component';

export {
    XmTextTranslateModule,
} from './xm-text-translate.module';

export const XM_TEXT_TRANSLATE_ENTRY: XmDynamicEntry = {
    selector: '@xm-ngx/components/text-translate',
    loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextTranslateModule),
};
