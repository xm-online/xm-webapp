export class DatePickerOptionsModel {
    constructor(public pickerType?: string,
                public floatLabel?: string,
                public themeColor?: string,
                public formatString?: string,
                public errorMessage?: string,
                public readonly?: boolean,
                public required?: boolean) {
    }
}
