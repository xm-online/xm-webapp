import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderModule } from '@xm-ngx/components/loader';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { PerPageModule } from '@xm-ngx/components/xm-per-page';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmTranslationModule } from '@xm-ngx/translation';
import { NgJhipsterModule } from 'ng-jhipster';
import { XmSharedModule } from '../../../../src/app/shared/shared.module';
import { RoleConditionDialogComponent } from './roles-management-condition-dialog.component';
import { RoleMgmtDeleteDialogComponent } from './roles-management-delete-dialog.component';
import { RoleMgmtDetailComponent } from './roles-management-detail.component';
import { RoleMgmtDialogComponent } from './roles-management-dialog.component';
import { RolesMgmtComponent } from './roles-management.component';

@NgModule({
    imports: [
        LoaderModule,
        XmTranslationModule,
        NgJhipsterModule,
        RouterModule,
        NgbPaginationModule,
        PerPageModule,
        NoDataModule,
        MatButtonModule,
        XmPermissionModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        XmSharedModule,
    ],
    exports: [RolesMgmtComponent],
    declarations: [
        RolesMgmtComponent,
        RoleMgmtDialogComponent,
        RoleConditionDialogComponent,
        RoleMgmtDetailComponent,
        RoleMgmtDeleteDialogComponent,
    ],
    providers: [],
})
export class RolesManagementModule {
    public entry: Type<RolesMgmtComponent> = RolesMgmtComponent;
}
