import { NgModule } from '@angular/core';
import { XmDynamicPresentationConstructor, XmDynamicPresentationEntryModule } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmEnumComponent } from './xm-enum.component';

@NgModule({
    imports: [XmTranslationModule],
    exports: [XmEnumComponent],
    declarations: [XmEnumComponent],
})
export class XmEnumModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmEnumComponent;
}
