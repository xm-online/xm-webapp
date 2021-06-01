import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmPermissionModule as XmPermissionModuleV2 } from '../../../../packages/core/permission/src/xm-permission.module';
import { PermitDirective } from './privilege.directive';
import { XmPrivilegeDirective } from './xmPrivilege.directive';

@NgModule({
    declarations: [PermitDirective, XmPrivilegeDirective],
    exports: [XmPermissionModuleV2, PermitDirective, XmPrivilegeDirective],
    imports: [
        XmPermissionModuleV2,
        CommonModule,
    ],
})
export class XmPermissionModule {
}
