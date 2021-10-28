import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PermissionDirective } from './directives/permission.directive';
import { XmIfSessionDirective } from './directives/xm-if-session.directive';

@NgModule({
    declarations: [PermissionDirective, XmIfSessionDirective],
    exports: [PermissionDirective, XmIfSessionDirective],
    imports: [
        CommonModule,
    ],
})
export class XmPermissionModule {
}
