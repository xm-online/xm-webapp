import { NgModule } from '@angular/core';
import { XmDynamicPresentationConstructor } from '@xm-ngx/dynamic';
import { XmDynamicPresentationEntryModule } from '../../../dynamic/src/presentation';
import { XmTextComponent } from './xm-text.component';

@NgModule({
    exports: [XmTextComponent],
    declarations: [XmTextComponent],
})
export class XmTextModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmTextComponent;
}
