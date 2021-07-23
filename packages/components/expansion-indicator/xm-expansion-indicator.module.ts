import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmExpansionIndicatorComponent } from './xm-expansion-indicator.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [XmExpansionIndicatorComponent],
    exports: [XmExpansionIndicatorComponent],
    imports: [
        CommonModule,
        MatButtonModule,
    ],
})
export class XmExpansionIndicatorModule {
}
