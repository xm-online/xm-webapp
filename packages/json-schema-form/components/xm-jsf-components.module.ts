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
import {
    MultilingualInputV2Component,
} from './multilingual-input-v2/multilingual-input-v2.component';

@NgModule({
    imports: [
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
        MultilingualInputV2Component,
        DatetimeUtcComponent,
        DatetimePickerComponent,
        DatePickerComponent,
        EmailMatcherComponent,
        TextSectionComponent,
        FileUploadComponent,
    ],
    exports: [
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
        MultilingualInputV2Component,
        DatetimeUtcComponent,
        DatetimePickerComponent,
        DatePickerComponent,
        EmailMatcherComponent,
        TextSectionComponent,
        FileUploadComponent,
    ],
    declarations: [],
    providers: [
        ExtAutocompleteService,
        ExtSelectService,
    ],
})
export class XmJsfComponentsModule {
}
