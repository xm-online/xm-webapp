import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BoolOptions, XM_BOOL_VIEW_ICONS } from './xm-bool-view.injectors';
import { BoolViewComponent } from './xm-bool-view.component';

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
}
