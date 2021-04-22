import { NgModule } from '@angular/core';
import { XmDynamicPresentationConstructor, XmDynamicPresentationEntryModule } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';

import { XmTextTitleComponent } from './xm-text-title.component';

@NgModule({
    imports: [XmTranslationModule],
    exports: [XmTextTitleComponent],
    declarations: [XmTextTitleComponent],
})
export class XmTextTitleModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmTextTitleComponent;
}
