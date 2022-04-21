import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmCheckboxComponent, XmCheckboxInterface } from './xm-checkbox.component';
import { XmDynamicPresentationConstructor } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    declarations: [XmCheckboxComponent],
    imports: [CommonModule, XmTranslationModule, MatCheckboxModule],
    exports: [XmCheckboxComponent],
})
export class XmCheckboxModule {
    public entry: XmDynamicPresentationConstructor<boolean, XmCheckboxInterface> = XmCheckboxComponent;
}
