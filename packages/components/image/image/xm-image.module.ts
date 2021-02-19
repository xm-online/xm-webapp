import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { XmImageComponent } from './xm-image.component';


@NgModule({
    declarations: [XmImageComponent],
    exports: [XmImageComponent],
    imports: [CommonModule],
})
export class XmImageModule {
    public entry: Type<XmImageComponent> = XmImageComponent;
}
