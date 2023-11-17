import { NgModule } from '@angular/core';
import { ContentTextareaComponent } from '../components/content-textarea/content-textarea.component';
import { CurrentLocationComponent } from '../components/current-location/current-location.component';
import { DatePickerComponent } from '../components/date-picker/date-picker.component';
import { DatetimePickerComponent } from '../components/datetime-picker/datetime-picker.component';
import { DatetimeUtcComponent } from '../components/datetime-utc/datetime-utc.component';
import { EmailMatcherComponent } from '../components/email-matcher/email-matcher.component';
import { ExtAutocompleteService } from '../components/ext-autocomplete/ext-autocomplete-service';
import { ExtAutocompleteComponent } from '../components/ext-autocomplete/ext-autocomplete.component';
import { ExtMdEditorComponent } from '../components/ext-md-editor/ext-md-editor.component';
import { ExtMultiSelectComponent } from '../components/ext-multi-select/ext-multi-select.component';
import { ExtQuerySelectComponent } from '../components/ext-query-select/ext-query-select.component';
import { ExtSelectService } from '../components/ext-select/ext-select-service';
import { ExtSelectComponent } from '../components/ext-select/ext-select.component';
import { ExtTextareaComponent } from '../components/ext-textarea/ext-textarea.component';
import { GeoInputComponent } from '../components/geo-input/geo-input.component';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';
import { LinkFieldComponent } from '../components/link-field/link-field.component';
import { MultilingualInputComponent } from '../components/multilingual-input/multilingual-input.component';
import { TextSectionComponent } from '../components/text-section/text-section.component';
import { ValidationComponent } from '../components/validation-component/validation-component.component';
import {
    MultilingualInputV2Component,
} from '../components/multilingual-input-v2/multilingual-input-v2.component';

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
export class XmJsonSchemaComponentsModule {
}
