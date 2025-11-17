import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Date range validator & Date-time range validator
 *
 * 1. startDate : endDate
 *-----------------------
 *  startDateKey:       'startDate',
 *  endDateKey:         'endDate',
 *
 * 2. startDate + startTime : endDate + endTime
 *---------------------------------------------
 *  startDateKey:       'startDate',
 *  endDateKey:         'endDate',
 *  startTimeKey:       'startTime',
 *  endTimeKey:         'endTime'
 *
 * 3. startDate + startTime : endDate
 *------------------------------------
 *  startDateKey:       'startDate',
 *  endDateKey:         'endDate',
 *  startTimeKey:       'startTime'
 */
export function dateTimeRangeValidator(options: {
    startDateKey: string;
    endDateKey: string;
    startTimeKey?: string;
    endTimeKey?: string;
}): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const startDate = <string>group.get(options.startDateKey)?.value;
        const endDate = <string>group.get(options.endDateKey)?.value;

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
            group.get(options.startDateKey)?.setErrors({ tooLate: true });
            group.get(options.endDateKey)?.setErrors({ tooEarly: true });

            return { rangeInvalid: true };
        }
        group.get(options.startDateKey)?.setErrors(null);
        group.get(options.endDateKey)?.setErrors(null);


        return null;
    };
}
