import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { LoaderModule } from '@xm-ngx/components/loader';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { XmTranslationModule } from '@xm-ngx/translation';
import { JhiHealthModalComponent } from './health-modal.component';
import { JhiHealthCheckComponent } from './health.component';
import { JhiHealthService } from './health.service';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';

@NgModule({
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        LoaderModule,
        MatIconModule,
        MatButtonModule,
        XmTranslationModule,
        NoDataModule,
        MatDialogModule,
        CommonModule,
        MatTableModule,
        MatCardModule,
        ModalCloseModule,
    ],
    exports: [JhiHealthCheckComponent],
    declarations: [JhiHealthCheckComponent, JhiHealthModalComponent],
    providers: [JhiHealthService],
})
export class HealthModule {
    public entry: Type<JhiHealthCheckComponent> = JhiHealthCheckComponent;
}
