import { NgModule } from '@angular/core';
import { XmCodeContainerJsonModule } from './xm-code-container-json.directive';
import { XmCopyIconComponent } from '@xm-ngx/components/copy';
import { XmCodeContainerComponent } from './xm-code-container.component';

@NgModule({
    imports: [
        XmCopyIconComponent,
    ],
    exports: [
        XmCodeContainerComponent,
        XmCodeContainerJsonModule,
    ],
    declarations: [XmCodeContainerComponent],
})
export class XmCodeContainerModule {
}
