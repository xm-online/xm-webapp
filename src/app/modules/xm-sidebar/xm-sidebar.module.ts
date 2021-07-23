import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { XmLogoModule } from '@xm-ngx/components/logo';
import { XmMenuModule } from '@xm-ngx/components/menu';
import { XmPoweredByModule } from '@xm-ngx/components/powered-by';
import { XmSidebarUserModule } from '@xm-ngx/components/sidebar-user';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { XmDynamicModule } from '@xm-ngx/dynamic';

import { SidebarComponent } from './sidebar.component';
import { MatDividerModule } from '@angular/material/divider';

export const SIDEBAR_KEY = 'xm-widget-sidebar';

@NgModule({
    declarations: [
        SidebarComponent,
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
        {provide: SIDEBAR_KEY, useValue: SidebarComponent},
        XmUiConfigService,
    ],
    exports: [SidebarComponent],
})
export class XmSidebarModule {}
