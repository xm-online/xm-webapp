import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { XmDynamicPresentationConstructor, XmDynamicPresentationEntryModule } from '@xm-ngx/dynamic';
import { XmIconEnumComponent } from './xm-icon-enum.component';

@NgModule({
    imports: [MatIconModule],
    exports: [XmIconEnumComponent],
    declarations: [XmIconEnumComponent],
})
export class XmIconEnumModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmIconEnumComponent;
}
