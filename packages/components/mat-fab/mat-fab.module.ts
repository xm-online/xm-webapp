import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { IfDashboardSlugModule } from '@xm-ngx/components/if-dashboard-slug';
import { IWidget } from '@xm-ngx/dynamic';
import { XmSharedModule } from '@xm-ngx/shared';
import { MatFabWidget } from './mat-fab-widget.component';

@NgModule({
    declarations: [MatFabWidget],
    entryComponents: [MatFabWidget],
    exports: [MatFabWidget],
    imports: [CommonModule, MatButtonModule, XmSharedModule, IfDashboardSlugModule, RouterModule],
})
export class MatFabModule {
    public entry: Type<IWidget> = MatFabWidget;
}
