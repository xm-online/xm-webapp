import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmPasswordNeededModule } from '@xm-ngx/components/password-needed';
import { XmTranslationModule } from '@xm-ngx/translation';
import { JhiConfigService, NgJhipsterModule } from 'ng-jhipster';
import { XmMaintenanceViewModule } from '@xm-ngx/components/maintenance';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { PerPageModule } from '@xm-ngx/components/per-page';
import { XmInputPatternModule } from '@xm-ngx/components/inputPattern';
import { WordAutocompleteModule } from '@xm-ngx/components/text/input/word-autocomplete.directive';
import { LanguageModule } from '@xm-ngx/translation';
import { XmCoreModule } from '@xm-ngx/core';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmAlertModule } from '@xm-ngx/alert';
import { MatModule } from '../../../src/app/mat.module';

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
        NgbModule,
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
            useValue: new JhiConfigService({defaultI18nLang: 'en', i18nEnabled: true}),
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
        NgbModule,
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
/** @deprecated Don't use GateSharedLibsModule */
export class GateSharedLibsModule {
}
