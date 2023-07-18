import { FloatLabelType } from '@angular/material/form-field';

export class DatePickerOptionsModel {
    constructor(public pickerType?: string,
                public floatLabel?: FloatLabelType,
                public placeholder?: string,
                public themeColor?: string,
                public formatString?: string,
                public errorMessage?: string,
                public readonly?: boolean,
                public required?: boolean) {
    }
}
