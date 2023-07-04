import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { XmTranslationModule } from '@xm-ngx/translation';

import { XmAlertService } from './xm-alert.service';
import { XmAlertConfigService } from './xm-alert-config.service';

@NgModule({
    imports: [
        CommonModule,
        XmTranslationModule,
    ],
    providers: [],
})
export class XmAlertModule {
    public static forRoot(): ModuleWithProviders<XmAlertModule> {
        return {
            ngModule: XmAlertModule,
            providers: [
                XmAlertService,
                XmAlertConfigService,
            ],
        };
    }
}
