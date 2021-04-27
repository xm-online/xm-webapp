import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { XmBoolComponent } from './xm-bool.component';
import { XmBoolOptions, XM_BOOL_VIEW_ICONS } from './xm-bool.injectors';

const XM_BOOL_VIEW_ICONS_DEFAULT: XmBoolOptions = {
    true: 'done',
    false: 'remove',
};

@NgModule({
    imports: [MatIconModule, CommonModule],
    exports: [XmBoolComponent],
    declarations: [XmBoolComponent],
    providers: [{ provide: XM_BOOL_VIEW_ICONS, useValue: XM_BOOL_VIEW_ICONS_DEFAULT }],
})
export class XmBoolModule {
    public entry: Type<XmBoolComponent> = XmBoolComponent;
}
