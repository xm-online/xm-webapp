import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmCodeModule } from '@xm-ngx/components/code';
import { XmCopyIconComponent } from '@xm-ngx/components/copy';
import { XmCopyExampleComponent } from './xm-copy-example.component';


@NgModule({
    declarations: [XmCopyExampleComponent],
    exports: [XmCopyExampleComponent],
    imports: [
        CommonModule,
        XmCopyIconComponent,
        XmCodeModule,
    ],
})
export class XmCopyExampleModule {
}
