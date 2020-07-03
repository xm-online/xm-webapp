import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MaintenanceComponent } from './maintenance.component';

@NgModule({
    declarations: [MaintenanceComponent],
    exports: [MaintenanceComponent],
    imports: [CommonModule, XmTranslationModule],
})
export class XmMaintenanceViewModule {
}
