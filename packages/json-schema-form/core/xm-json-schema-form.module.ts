import {
    Framework,
    FrameworkLibraryService,
    JsonSchemaFormModule,
    JsonSchemaFormService,
    WidgetLibraryService,
} from '@ajsf/core';
import {
    MaterialDesignFrameworkModule,
} from '@ajsf/material';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RU_INTL } from '@xm-ngx/json-schema-form/locale/ru-config';
import { UK_INTL } from '@xm-ngx/json-schema-form/locale/uk-config';
import { LanguageService } from '@xm-ngx/translation';
import { XmMaterialDesignFramework } from '@xm-ngx/json-schema-form/core/material-design-framework';
import { fixFlexLayout } from './fix-flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { XmFlexLayoutSectionComponent } from '@xm-ngx/json-schema-form/components/flex-layout-section.component';
import { XmMaterialDesignFrameworkComponent } from '@xm-ngx/json-schema-form/components/material-design-framework.component';
import { XmFlexLayoutRootComponent } from '@xm-ngx/json-schema-form/components/flex-layout-root.component';


import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XmJsonSchemaFormService } from '@xm-ngx/json-schema-form/core/xm-json-schema-form.service';

const _JsonSchemaFormModule = {
    ngModule: JsonSchemaFormModule,
    providers: [
        JsonSchemaFormService,
        XmJsonSchemaFormService,
        FrameworkLibraryService,
        WidgetLibraryService,
        { provide: Framework, useClass: XmMaterialDesignFramework, multi: true },
        { provide: JsonSchemaFormService, useClass: XmJsonSchemaFormService },
    ],
};

fixFlexLayout();

export const ANGULAR_MATERIAL_MODULES = [
    MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule,
    MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatExpansionModule,
    MatFormFieldModule, MatIconModule, MatInputModule, MatNativeDateModule,
    MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule,
    MatStepperModule, MatTabsModule, MatTooltipModule,
    MatToolbarModule, MatMenuModule, MatToolbarModule,
];


@NgModule({
    declarations: [
        XmFlexLayoutRootComponent,
        XmFlexLayoutSectionComponent,
        XmMaterialDesignFrameworkComponent,
    ],
    imports: [
        CommonModule,
        DragDropModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialDesignFrameworkModule,
        ...ANGULAR_MATERIAL_MODULES,
        _JsonSchemaFormModule,
    ],
    exports: [
        MaterialDesignFrameworkModule,
        JsonSchemaFormModule,
    ],
    providers: [
        {
            provide: JsonSchemaFormService,
            useExisting: XmJsonSchemaFormService,
        },
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
