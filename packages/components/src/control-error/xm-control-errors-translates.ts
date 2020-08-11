import { InjectionToken } from '@angular/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Translate } from '@xm-ngx/translation';

export const XM_CONTROL_ERRORS_TRANSLATES = new InjectionToken('XM_CONTROL_ERRORS_TRANSLATES');

export const XM_CONTROL_ERRORS_TRANSLATES_DEFAULT: { [errorKey: string]: Translate } = {
    min: marker('xm-control-errors.validators.min'),
    max: marker('xm-control-errors.validators.max'),
    required: marker('xm-control-errors.validators.required'),
    email: marker('xm-control-errors.validators.email'),
    minlength: marker('xm-control-errors.validators.minlength'),
    maxlength: marker('xm-control-errors.validators.maxlength'),
    pattern: marker('xm-control-errors.validators.pattern'),
};
