import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { XmLogoModule } from '@xm-ngx/components/logo';
import { XmMenuModule } from '@xm-ngx/components/menu';
import { XmPoweredByModule } from '@xm-ngx/components/powered-by';
import { XmSidebarUserModule } from '@xm-ngx/components/sidebar-user';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { MatDividerModule } from '@angular/material/divider';

import { xmSidebarComponent } from './components/xm-sidebar.component';
import { XmSidebarStoreService } from './stores/xm-sidebar-store.service';
import { XM_SIDEBAR_CONFIG, XM_SIDEBAR_CONFIG_DEFAULT, XmSidebarConfig } from './configs/xm-sidebar.config';

export const XM_SIDEBAR_KEY = 'xm-widget-sidebar';

@NgModule({
    declarations: [
        xmSidebarComponent,
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
        { provide: XM_SIDEBAR_KEY, useValue: xmSidebarComponent },
        XmUiConfigService,
    ],
    exports: [xmSidebarComponent],
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
