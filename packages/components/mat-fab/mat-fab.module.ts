import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { IfDashboardSlugModule } from '@xm-ngx/components/if-dashboard-slug';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatFabWidget } from './mat-fab-widget.component';

@NgModule({
    declarations: [MatFabWidget],
    exports: [MatFabWidget],
    imports: [
        CommonModule,
        MatButtonModule,
        XmPermissionModule,
        IfDashboardSlugModule,
        RouterModule,
        MatTooltipModule,
        MatIconModule,
        XmTranslationModule,
    ]
})
export class MatFabModule {
    public entry: Type<XmDynamicWidget> = MatFabWidget;
}
