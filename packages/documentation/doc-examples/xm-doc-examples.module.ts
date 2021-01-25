// #regionstart dynamic-imports
// #regionend dynamic-imports
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { XmTextControlModule } from '@xm-ngx/components/xm-text-control';
import { XmDocExamplesComponent } from './xm-doc-examples.component';

@NgModule({
    declarations: [XmDocExamplesComponent],
    exports: [XmDocExamplesComponent],
    imports: [
        CommonModule,
        XmTextControlModule,
        MatButtonModule,
        MatTabsModule,
        // #regionstart dynamic-module-imports
        // #regionend dynamic-module-imports
    ],
})
export class XmDocExamplesModule {
    public entry: Type<XmDocExamplesComponent> = XmDocExamplesComponent;
}
