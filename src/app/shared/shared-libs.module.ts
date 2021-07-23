import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmPasswordNeededModule } from '@xm-ngx/components/password-needed';
import { XmSharedModule } from '@xm-ngx/shared';
import { XmTranslationModule } from '@xm-ngx/translation';
import { JhiConfigService, NgJhipsterModule } from 'ng-jhipster';
import { XmMaintenanceViewModule } from '@xm-ngx/components/maintenance';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { PerPageModule } from '@xm-ngx/components/per-page';
import { XmInputPatternModule } from '@xm-ngx/components/inputPattern';
import { WordAutocompleteModule } from './directives/word-autocomplete.directive';
import { LanguageModule } from './language/language.module';

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
        XmSharedModule,
        NgbModule,
        NgJhipsterModule,
        XmTranslationModule.forChild(),
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
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
        XmSharedModule,
        NgbModule,
        NgJhipsterModule,
        XmTranslationModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
    ],
})
/** @deprecated Don't use GateSharedLibsModule */
export class GateSharedLibsModule {
}
