import { NgModule, Type } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { BoolViewComponent } from './xm-bool-view.component';
import { BoolOptions, XM_BOOL_VIEW_ICONS } from './xm-bool-view.injectors';

const XM_BOOL_VIEW_ICONS_DEFAULT: BoolOptions = {
    true: 'done',
    false: 'remove',
};

@NgModule({
    imports: [MatIconModule],
    exports: [BoolViewComponent],
    declarations: [BoolViewComponent],
    providers: [{ provide: XM_BOOL_VIEW_ICONS, useValue: XM_BOOL_VIEW_ICONS_DEFAULT }],
})
export class XmBoolViewModule {
    public entry: Type<BoolViewComponent> = BoolViewComponent;
}
