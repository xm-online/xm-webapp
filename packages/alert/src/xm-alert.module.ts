import { ModuleWithProviders, NgModule } from '@angular/core';
import { XmAlertService } from './xm-alert.service';

@NgModule({})
export class XmAlertModule {
    public static forRoot(): ModuleWithProviders<XmAlertModule> {
        return {
            ngModule: XmAlertModule,
            providers: [
                XmAlertService,
            ],
        };
    }
}
