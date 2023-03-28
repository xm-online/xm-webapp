import { ITranslate } from '@xm-ngx/translation';
import { FloatLabelType } from '@angular/material/form-field';

export interface GeoInputOptions {
    predictionType?: 'establishment' | 'address' | 'geocode'[];
    title?: string | ITranslate;
    placeholder?: string | ITranslate;
    disabled?: boolean;
    required?: boolean;
    floatLabel?: FloatLabelType;
}
