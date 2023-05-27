import { NgModule } from '@angular/core';
import { ContentTextareaComponent } from './content-textarea/content-textarea.component';
import { CurrentLocationComponent } from './current-location/current-location.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DatetimePickerComponent } from './datetime-picker/datetime-picker.component';
import { DatetimeUtcComponent } from './datetime-utc/datetime-utc.component';
import { EmailMatcherComponent } from './email-matcher/email-matcher.component';
import { ExtAutocompleteService } from './ext-autocomplete/ext-autocomplete-service';
import { ExtAutocompleteComponent } from './ext-autocomplete/ext-autocomplete.component';
import { ExtMdEditorComponent } from './ext-md-editor/ext-md-editor.component';
import { ExtMultiSelectComponent } from './ext-multi-select/ext-multi-select.component';
import { ExtQuerySelectComponent } from './ext-query-select/ext-query-select.component';
import { ExtSelectService } from './ext-select/ext-select-service';
import { ExtSelectComponent } from './ext-select/ext-select.component';
import { ExtTextareaComponent } from './ext-textarea/ext-textarea.component';
import { GeoInputComponent } from './geo-input/geo-input.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { LinkFieldComponent } from './link-field/link-field.component';
import { MultilingualInputComponent } from './multilingual-input/multilingual-input.component';
import { TextSectionComponent } from './text-section/text-section.component';
import { ValidationComponent } from './validation-component/validation-component.component';
import { MultilingualInputV2Component } from './multilingual-input-v2/multilingual-input-v2.component';
import { MatInputModule } from '@angular/material/input';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmGMapApiInitDirective } from '@xm-ngx/components/xmGMapApiInit.directive';
import { MatButtonModule } from '@angular/material/button';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputPreventPasteDirective } from '@xm-ngx/components/text';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
    imports: [
        MatInputModule,
        MatButtonModule,
        OwlDateTimeModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputPreventPasteDirective,
        CovalentTextEditorModule,
        XmGMapApiInitDirective,
        MatSelectModule,
        XmTranslationModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        AngularEditorModule,
        XmTranslationModule,
    ],
    exports: [
        CurrentLocationComponent,
        ExtSelectComponent,
        ExtAutocompleteComponent,
        ExtMultiSelectComponent,
        ExtQuerySelectComponent,
        ValidationComponent,
        ExtTextareaComponent,
        GeoInputComponent,
        ContentTextareaComponent,
        LinkFieldComponent,
        ExtMdEditorComponent,
        MultilingualInputComponent,
        DatetimeUtcComponent,
        DatetimePickerComponent,
        DatePickerComponent,
        EmailMatcherComponent,
        TextSectionComponent,
        FileUploadComponent,
        MultilingualInputV2Component,
    ],
    declarations: [
        CurrentLocationComponent,
        ExtSelectComponent,
        ValidationComponent,
        ExtAutocompleteComponent,
        ExtMultiSelectComponent,
        ExtQuerySelectComponent,
        ExtTextareaComponent,
        GeoInputComponent,
        ContentTextareaComponent,
        LinkFieldComponent,
        ExtMdEditorComponent,
        MultilingualInputComponent,
        DatetimeUtcComponent,
        DatetimePickerComponent,
        DatePickerComponent,
        EmailMatcherComponent,
        TextSectionComponent,
        FileUploadComponent,
        MultilingualInputV2Component,
    ],
    providers: [
        ExtSelectService,
        ExtAutocompleteService,
    ],
})
export class XmJsonSchemaComponentsModule {
}
