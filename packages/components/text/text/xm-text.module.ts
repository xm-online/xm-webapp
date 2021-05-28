import { NgModule } from '@angular/core';
import { XmDynamicPresentationConstructor, XmDynamicPresentationEntryModule } from '@xm-ngx/dynamic';
import { XmTextComponent } from './xm-text.component';

@NgModule({
    exports: [XmTextComponent],
    declarations: [XmTextComponent],
})
export class XmTextModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmTextComponent;
}
