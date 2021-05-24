import { ModuleWithProviders, NgModule } from '@angular/core';
import { XmLoggerWatcherService } from './xm-logger-watcher.service';
import { XmLoggerService} from './xm-logger.service';


@NgModule()
export class XmLoggerModule {
    public static forRoot(): ModuleWithProviders<XmLoggerModule> {
        return {
            providers: [XmLoggerService, XmLoggerWatcherService],
            ngModule: XmLoggerModule,
        };
    }
}
