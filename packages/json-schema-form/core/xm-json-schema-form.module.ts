import {
    Framework,
    FrameworkLibraryService,
    JsonSchemaFormModule,
    JsonSchemaFormService,
    WidgetLibraryService,
} from '@ajsf/core';
import { MaterialDesignFramework, MaterialDesignFrameworkModule } from '@ajsf/material';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RU_INTL } from '@xm-ngx/json-schema-form/locale/ru-config';
import { UK_INTL } from '@xm-ngx/json-schema-form/locale/uk-config';
import { LanguageService } from '@xm-ngx/translation';
import { fixFlexLayout } from './fix-flex-layout';

const _JsonSchemaFormModule = {
    ngModule: JsonSchemaFormModule,
    providers: [
        JsonSchemaFormService,
        FrameworkLibraryService,
        WidgetLibraryService,
        { provide: Framework, useClass: MaterialDesignFramework, multi: true },
    ],
};

fixFlexLayout();

@NgModule({
    imports: [
        CommonModule,
        MaterialDesignFrameworkModule,
        _JsonSchemaFormModule,
    ],
    exports: [
        MaterialDesignFrameworkModule,
        JsonSchemaFormModule,
    ],
})
export class XmJsonSchemaFormModule {

    /**
     Luck of ajsf architecture.
     When ajsf provide a way to configure the locales, the following code should be transferred to the configuration.
     TODO: Workaround
     */
    constructor(
        languageService: LanguageService,
        jsonSchemaFormService: JsonSchemaFormService) {
        switch (languageService.locale) {
            case 'ru':
                jsonSchemaFormService.defaultFormOptions.defautWidgetOptions.validationMessages = RU_INTL;
                break;
            case 'uk':
                jsonSchemaFormService.defaultFormOptions.defautWidgetOptions.validationMessages = UK_INTL;
                break;
        }
    }

}
