import { NgModule } from '@angular/core';
import { XmDynamicPresentationConstructor, XmDynamicPresentationEntryModule } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';

import { XmTextTranslateComponent } from './xm-text-translate.component';

@NgModule({
    imports: [XmTranslationModule],
    exports: [XmTextTranslateComponent],
    declarations: [XmTextTranslateComponent],
})
export class XmTextTranslateModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmTextTranslateComponent;
}
