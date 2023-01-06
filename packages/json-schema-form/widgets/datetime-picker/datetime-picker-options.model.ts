import { FloatLabelType } from '@angular/material/form-field';
import { PickerType } from '@danielmoncada/angular-datetime-picker';

export class DatetimePickerOptionsModel {
    constructor(public pickerType?: PickerType,
                public floatLabel?: FloatLabelType,
                public title?: string,
                public placeholder?: string,
                public errorMessage?: unknown,
                public themeColor?: string,
                public formatString?: string,
                public sendFormatString?: string) {
    }
}
