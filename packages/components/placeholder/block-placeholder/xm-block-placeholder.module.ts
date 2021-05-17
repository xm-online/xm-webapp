import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmBlockPlaceholderComponent } from './xm-block-placeholder.component';

@NgModule({
    declarations: [XmBlockPlaceholderComponent],
    exports: [XmBlockPlaceholderComponent],
    imports: [
        CommonModule,
    ],
})
export class XmBlockPlaceholderModule {
}
