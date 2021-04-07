import { ModuleWithProviders, NgModule } from '@angular/core';
import { XmLoggerService } from './xm-logger.service';


@NgModule()
export class XmLoggerModule {
    public static forRoot(): ModuleWithProviders<XmLoggerModule> {
        return {
            providers: [XmLoggerService],
            ngModule: XmLoggerModule,
        };
    }
}
