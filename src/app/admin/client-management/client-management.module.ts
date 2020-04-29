import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderModule } from '@xm-ngx/components/loader';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { PerPageModule } from '@xm-ngx/components/xm-per-page';
import { XmTranslationModule } from '@xm-ngx/translation';
import { NgJhipsterModule } from 'ng-jhipster';
import { XmSharedModule } from '../../shared/shared.module';
import { ClientMgmtDeleteDialogComponent } from './client-management-delete-dialog.component';
import { ClientMgmtDialogComponent } from './client-management-dialog.component';
import { ClientMgmtComponent } from './client-management.component';

@NgModule({
    imports: [
        MatFormFieldModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        XmTranslationModule,
        LoaderModule,
        NgbPaginationModule,
        NoDataModule,
        NgJhipsterModule,
        PerPageModule,
        MatIconModule,
        MatDialogModule,
        XmSharedModule,
    ],
    exports: [ClientMgmtComponent],
    declarations: [ClientMgmtComponent, ClientMgmtDeleteDialogComponent, ClientMgmtDialogComponent],
    providers: [],
})
export class ClientManagementModule {
    public entry: Type<ClientMgmtComponent> = ClientMgmtComponent;
}
