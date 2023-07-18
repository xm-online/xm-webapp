import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';
import { XmEventManagerService as XmEventManager } from './xm-event-manager.service';
import { XM_CORE_EXTERNAL_CONFIG, XmCoreConfig } from './xm-core-config';
import { XmEventManagerService } from './xm-event-manager.service';

import { XmSessionService } from './xm-session.service';
import { merge } from 'lodash';

export function xmCoreConfigFactory(externalConfig?: XmCoreConfig): XmCoreConfig {
    return merge(new XmCoreConfig(), externalConfig);
}

@NgModule({
    imports: [CommonModule],
})
export class XmCoreModule {
    public static forRoot(externalConfig?: Partial<XmCoreConfig>): ModuleWithProviders<XmCoreModule> {
        return {
            ngModule: XmCoreModule,
            providers: [
                XmEventManagerService,
                {provide: JhiEventManager, useExisting: XmEventManagerService},
                XmSessionService,
                {provide: XM_CORE_EXTERNAL_CONFIG, useValue: externalConfig},
                {provide: XmCoreConfig, useFactory: xmCoreConfigFactory, deps: [XM_CORE_EXTERNAL_CONFIG]},
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: ErrorHandlerInterceptor,
                    multi: true,
                    deps: [XmEventManager],
                },
            ],
        };
    }

}
