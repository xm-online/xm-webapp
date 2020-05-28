import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LoaderModule } from '@xm-ngx/components/loader';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { XmTranslationModule } from '@xm-ngx/translation';
import { JhiHealthService } from '../health/health.service';
import { LogsComponent } from './logs.component';
import { LogsService } from './logs.service';

@NgModule({
    imports: [
        LoaderModule,
        XmTranslationModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        CommonModule,
        NoDataModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatCardModule,
    ],
    exports: [LogsComponent],
    declarations: [LogsComponent],
    providers: [LogsService, JhiHealthService],
})
export class LogsModule {
    public entry: Type<LogsComponent> = LogsComponent;
}
