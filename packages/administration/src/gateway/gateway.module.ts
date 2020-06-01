import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LoaderModule } from '@xm-ngx/components/loader';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmTranslationModule } from '@xm-ngx/translation';
import { NgJhipsterModule } from 'ng-jhipster';
import { JhiGatewayComponent } from './gateway.component';

@NgModule({
    imports: [
        LoaderModule,
        XmTranslationModule,
        NoDataModule,
        MatButtonModule,
        CommonModule,
        NgJhipsterModule,
        XmPermissionModule,
        MatCardModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
    ],
    exports: [JhiGatewayComponent],
    declarations: [JhiGatewayComponent],
    providers: [],
})
export class GatewayModule {
    public entry: Type<JhiGatewayComponent> = JhiGatewayComponent;
}
