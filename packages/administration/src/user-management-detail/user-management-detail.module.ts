import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LoaderModule } from '@xm-ngx/components/loader';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { XmTextViewModule } from '@xm-ngx/components/xm-text-view';
import { XmTranslationModule } from '@xm-ngx/translation';
import { UserMgmtDetailComponent } from './user-management-detail.component';

@NgModule({
    exports: [UserMgmtDetailComponent],
    declarations: [UserMgmtDetailComponent],
    imports: [
        CommonModule,
        LoaderModule,
        XmTranslationModule,
        NoDataModule,
        MatCardModule,
        XmTextViewModule,
        MatButtonModule,
    ],
})
export class UserManagementDetailModule {
    public entry: Type<UserMgmtDetailComponent> = UserMgmtDetailComponent;
}
