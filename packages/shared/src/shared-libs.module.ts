import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmPasswordNeededModule } from '@xm-ngx/components/password-needed';
import { XmTranslationModule } from '@xm-ngx/translation';
import { JhiConfigService, NgJhipsterModule } from '@xm-ngx/jhipster';
import { XmMaintenanceViewModule } from '@xm-ngx/components/maintenance';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { PerPageModule } from '@xm-ngx/components/per-page';
import { XmInputPatternModule } from '@xm-ngx/components/inputPattern';
import { WordAutocompleteModule } from '@xm-ngx/components/text';
import { LanguageModule } from '@xm-ngx/translation';
import { XmCoreModule } from '@xm-ngx/core';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmAlertModule } from '@xm-ngx/alert';
import { MatModule } from './mat.module';

/**
 * @deprecated Use `XmSharedModule` instead.
 */
@NgModule({
    imports: [
        LoaderModule,
        WordAutocompleteModule,
        PerPageModule,
        XmInputPatternModule,
        NoDataModule,
        LanguageModule,
        XmPasswordNeededModule,
        XmMaintenanceViewModule,
        NgJhipsterModule,
        XmTranslationModule.forChild(),
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        XmPermissionModule,
        XmAlertModule,
        XmCoreModule,
        XmTranslationModule,
        MatModule,
    ],
    providers: [
        {
            provide: JhiConfigService,
            useValue: new JhiConfigService({defaultI18nLang: 'en', i18nEnabled: true} as any),
        },
    ],
    exports: [
        WordAutocompleteModule,
        LoaderModule,
        PerPageModule,
        XmInputPatternModule,
        NoDataModule,
        LanguageModule,
        XmPasswordNeededModule,
        XmMaintenanceViewModule,
        NgJhipsterModule,
        XmTranslationModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        XmPermissionModule,
        XmAlertModule,
        XmCoreModule,
        MatModule,
    ],
})
export class GateSharedLibsModule {
}
