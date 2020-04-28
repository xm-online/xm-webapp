import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmTranslationModule } from '@xm-ngx/translation';
import { NgJhipsterModule } from 'ng-jhipster';
import { XmSharedModule } from '../../shared/shared.module';
import { UserMgmtDetailComponent } from './user-management-detail.component';
import { UserMgmtComponent } from './user-management.component';

@NgModule({
    imports: [
        LoaderModule,
        XmTranslationModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        NgJhipsterModule,
        RouterModule,
        XmSharedModule,
    ],
    exports: [UserMgmtComponent, UserMgmtDetailComponent],
    declarations: [UserMgmtComponent, UserMgmtDetailComponent],
    providers: [],
})
export class UserManagementModule {
}
