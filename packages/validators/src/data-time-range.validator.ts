import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Date range validator & Date-time range validator
 *
 * 1. startDate : endDate
 *-----------------------
 *  startKey:       'startDate',
 *  endKey:         'endDate',
 *
 * 2. startDate + startTime : endDate + endTime
 *---------------------------------------------
 *  startKey:       'startDate',
 *  endKey:         'endDate',
 *  startTimeKey:   'startTime',
 *  endTimeKey:     'endTime'
 *
 * 3. startDate + startTime : endDate
 *------------------------------------
 *  startKey:       'startDate',
 *  endKey:         'endDate',
 *  startTimeKey:   'startTime'
 */
export function dateTimeRangeValidator(options: {
    startKey: string;
    endKey: string;
    startTimeKey?: string;
    endTimeKey?: string;
}): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const startDate = <string>group.get(options.startKey)?.value;
        const endDate = <string>group.get(options.endKey)?.value;

        if (!startDate || !endDate) return null;

        const combine = (date: string, time?: string): Date => {
            const date_ = new Date(date);
            if (time) {
                const [h, m] = time.split(':').map(Number);
                date_.setHours(h, m, 0, 0);
            } else {
                date_.setHours(0, 0, 0, 0);
            }
            return date_;
        };

        const startTimeValue =
            options.startTimeKey ? group.get(options.startTimeKey)?.value as string | undefined : undefined;
        const start = combine(startDate, startTimeValue);

        const endTimeValue =
            options.endTimeKey ? group.get(options.endTimeKey)?.value as string | undefined : undefined;
        const end = combine(endDate, endTimeValue);


        if (start > end) {
            group.get(options.startKey)?.setErrors({ tooLate: true });
            group.get(options.endKey)?.setErrors({ tooEarly: true });

            return { rangeInvalid: true };
        }
        group.get(options.startKey)?.setErrors(null);
        group.get(options.endKey)?.setErrors(null);


        return null;
    };
}
