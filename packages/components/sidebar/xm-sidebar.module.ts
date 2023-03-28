import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { XmLogoModule } from '@xm-ngx/components/logo';
import { XmMenuModule } from '@xm-ngx/components/menu';
import { XmPoweredByModule } from '@xm-ngx/components/powered-by';
import { XmSidebarUserModule } from '@xm-ngx/components/sidebar-user';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { MatDividerModule } from '@angular/material/divider';

import { XmSidebarComponent } from './sidebar.component';
import { XmSidebarStoreService } from './stores/xm-sidebar-store.service';
import { XM_SIDEBAR_CONFIG, XM_SIDEBAR_CONFIG_DEFAULT, XmSidebarConfig } from './configs/xm-sidebar.config';

export const XM_SIDEBAR_KEY = 'xm-widget-sidebar';

@NgModule({
    declarations: [
        XmSidebarComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        XmLogoModule,
        XmSidebarUserModule,
        XmMenuModule,
        XmPoweredByModule,
        XmDynamicModule,
        MatDividerModule,
    ],
    providers: [
        { provide: XM_SIDEBAR_KEY, useValue: XmSidebarComponent },
    ],
    exports: [XmSidebarComponent],
})
export class XmSidebarModule {
    public static forRoot(config: XmSidebarConfig = XM_SIDEBAR_CONFIG_DEFAULT): ModuleWithProviders<XmSidebarModule> {
        return {
            ngModule: XmSidebarModule,
            providers: [
                { provide: XM_SIDEBAR_CONFIG, useValue: config },
                XmSidebarStoreService,
            ],
        };
    }
}
