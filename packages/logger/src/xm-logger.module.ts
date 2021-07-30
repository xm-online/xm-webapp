import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { XmLoggerWatcherService } from './xm-logger-watcher.service';
import { XmLoggerService } from './services/xm-logger.service';
import { XmLoggerFactoryDefault } from './services/xm-logger-factory.service';
import { XmLogBrokerDefault } from './services/xm-log-broker.service';
import { XmLogBroker } from './interfaces/xm-log-broker';
import { XmLoggerFactory } from './interfaces/xm-logger-factory';
import { XmLogger } from './interfaces/xm-logger';

interface XmLoggerModuleConfig {
    logBroker?: Provider;
    logFactory?: Provider;
    logger?: Provider;
}

@NgModule()
export class XmLoggerModule {
    public static forRoot(config: XmLoggerModuleConfig = {}): ModuleWithProviders<XmLoggerModule> {
        return {
            providers: [
                config.logBroker || { provide: XmLogBroker, useClass: XmLogBrokerDefault },
                config.logBroker || { provide: XmLoggerFactory, useClass: XmLoggerFactoryDefault },
                config.logger || { provide: XmLogger, useClass: XmLoggerService },
                XmLoggerWatcherService,
            ],
            ngModule: XmLoggerModule,
        };
    }
}
