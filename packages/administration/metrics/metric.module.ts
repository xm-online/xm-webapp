import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { LoaderModule } from '@xm-ngx/components/loader';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { XmTranslationModule } from '@xm-ngx/translation';
import { NgJhipsterModule } from '@xm-ngx/jhipster';
import { JhiMetricsMonitoringModalComponent } from './metrics-modal.component';
import { JhiMetricsMonitoringComponent } from './metrics.component';
import { JhiMetricsService } from './metrics.service';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
    imports: [
        XmTranslationModule,
        MatFormFieldModule,
        FormsModule,
        MatSelectModule,
        NoDataModule,
        MatProgressBarModule,
        LoaderModule,
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        NgJhipsterModule,
        MatIconModule,
        MatCardModule,
        ModalCloseModule,
    ],
    exports: [JhiMetricsMonitoringComponent],
    declarations: [JhiMetricsMonitoringComponent, JhiMetricsMonitoringModalComponent],
    providers: [JhiMetricsService],
})
export class MetricModule {
    public entry: Type<JhiMetricsMonitoringComponent> = JhiMetricsMonitoringComponent;
}
