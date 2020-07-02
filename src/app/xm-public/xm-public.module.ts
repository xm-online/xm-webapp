import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmDynamicModule } from '../../../packages/xm-dynamic/src/xm-dynamic.module';

import { XmPublicRoutingModule } from './xm-public-routing.module';
import { XmPublicComponent } from './xm-public.component';

@NgModule({
    declarations: [XmPublicComponent],
    exports: [XmPublicComponent],
    imports: [
        CommonModule,
        XmPublicRoutingModule,
        XmDynamicModule,
    ],
})
export class XmPublicModule { }
