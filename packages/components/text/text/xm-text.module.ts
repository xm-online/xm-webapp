import { NgModule } from '@angular/core';
import { XmDynamicPresentationConstructor, XmDynamicPresentationEntryModule } from '@xm-ngx/dynamic';
import { XmTemplatePipe } from 'packages/shared/pipes/template.pipe';
import { XmTextComponent } from './xm-text.component';

@NgModule({
    exports: [XmTextComponent],
    declarations: [XmTextComponent],
    imports: [XmTemplatePipe],
})
export class XmTextModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmTextComponent;
}
