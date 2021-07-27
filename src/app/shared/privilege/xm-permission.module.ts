import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmPermissionModule as XmPermissionModuleV2 } from '../../../../packages/core/permission/src/xm-permission.module';
import { XmPermittedDirective } from './xm-permitted.directive';

@NgModule({
    declarations: [XmPermittedDirective],
    exports: [XmPermissionModuleV2, XmPermittedDirective],
    imports: [
        XmPermissionModuleV2,
        CommonModule,
    ],
})
export class XmPermissionModule {
}
