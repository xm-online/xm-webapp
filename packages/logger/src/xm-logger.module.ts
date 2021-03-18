import { ModuleWithProviders, NgModule } from '@angular/core';
import { XmLogger } from './xm-logger';


@NgModule()
export class XmLoggerModule {
    public static forRoot(): ModuleWithProviders<XmLoggerModule> {
        return {
            providers: [XmLogger],
            ngModule: XmLoggerModule,
        };
    }
}
