import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MaintenanceComponent } from './maintenance.component';
import { XmDynamicModule } from '@xm-ngx/dynamic';

@NgModule({
    declarations: [MaintenanceComponent],
    exports: [MaintenanceComponent],
    imports: [CommonModule, XmTranslationModule, XmDynamicModule],
})
export class XmMaintenanceViewModule {
}
