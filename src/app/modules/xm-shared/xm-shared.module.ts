import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatModule } from '../../mat.module';
import { XmAlertModule } from '@xm-ngx/alert';
import { XmCoreModule } from '@xm-ngx/core';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmEntityModule } from '../../../../packages/entity';

@NgModule({
    imports: [
        XmPermissionModule,
        XmEntityModule,
        XmAlertModule,
        FormsModule,
        ReactiveFormsModule,
        XmCoreModule,
        XmTranslationModule,
        MatModule,
        CommonModule,
    ],
    exports: [
        XmPermissionModule,
        XmEntityModule,
        XmAlertModule,
        FormsModule,
        ReactiveFormsModule,
        XmCoreModule,
        XmTranslationModule,
        MatModule,
        CommonModule,
    ],
})
/** @deprecated Don't use XmSharedModule */
export class XmSharedModule {
}
