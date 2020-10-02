import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PermissionDirective } from './permission.directive';

@NgModule({
    declarations: [PermissionDirective],
    exports: [PermissionDirective],
    imports: [
        CommonModule,
    ],
})
export class XmPermissionModule {
}
