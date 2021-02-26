import { NgModule } from '@angular/core';
import { XmCodeContainerJsonModule } from '@xm-ngx/components/code/code-container/xm-code-container-json.directive';
import { XmCopyIconModule } from '@xm-ngx/components/copy';
import { XmCodeContainerComponent } from './xm-code-container.component';

@NgModule({
    imports: [
        XmCopyIconModule,
    ],
    exports: [
        XmCodeContainerComponent,
        XmCodeContainerJsonModule,
    ],
    declarations: [XmCodeContainerComponent],
})
export class XmCodeContainerModule {
}
