import { ITranslate } from '@xm-ngx/translation';

export interface GeoInputOptions {
    predictionType?: 'establishment' | 'address' | 'geocode'[];
    placeholder?: string | ITranslate;
}
