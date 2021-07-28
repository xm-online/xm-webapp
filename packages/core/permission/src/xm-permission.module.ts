import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PermissionDirective } from './directives/permission.directive';
import { XmIfSessionDirective } from './directives/xm-if-session.directive';
import { PermissionDirective } from './permission.directive';
import { XmPermittedDirective } from './directives/xm-permitted.directive';

@NgModule({
    declarations: [PermissionDirective, XmIfSessionDirective],
    exports: [PermissionDirective, XmIfSessionDirective],
    declarations: [PermissionDirective, XmPermittedDirective],
    exports: [PermissionDirective, XmPermittedDirective],
    imports: [
        CommonModule,
    ],
})
export class XmPermissionModule {
}
