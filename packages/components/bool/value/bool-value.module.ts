import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { BoolValueComponent } from './bool-value.component';
import { BoolOptions, XM_BOOL_VIEW_ICONS } from './bool-value.injectors';

const XM_BOOL_VIEW_ICONS_DEFAULT: BoolOptions = {
    true: 'done',
    false: 'remove',
};

@NgModule({
    imports: [MatIconModule, CommonModule],
    exports: [BoolValueComponent],
    declarations: [BoolValueComponent],
    providers: [{ provide: XM_BOOL_VIEW_ICONS, useValue: XM_BOOL_VIEW_ICONS_DEFAULT }],
})
export class BoolValueModule {
    public entry: Type<BoolValueComponent> = BoolValueComponent;
}
