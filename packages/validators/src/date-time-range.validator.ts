import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

interface DateTimeOptions {
    startDateKey: string;
    endDateKey: string;
    startTimeKey?: string;
    endTimeKey?: string;
}

interface WithMaxDaysOptions extends DateTimeOptions {
    maxDays: number;
}

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
export function dateTimeRangeValidator(options: DateTimeOptions): ValidatorFn {
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

/**
 * A plugin wrapper over the base date range validator
 * Extends the basic validator capability by adding a maximum days range available.
 */
export function maxDaysRangeValidator(options: WithMaxDaysOptions): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const baseValidator = dateTimeRangeValidator({
            startDateKey: options.startDateKey,
            endDateKey: options.endDateKey,
            startTimeKey: options.startTimeKey,
            endTimeKey: options.endTimeKey,
        });

        const baseErrors = baseValidator(group);

        if (baseErrors) return baseErrors;

        const startDate = <string>group.get(options.startDateKey)?.value;
        const endDate = <string>group.get(options.endDateKey)?.value;

        if (!startDate || !endDate) return null;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const diffInDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

        if (diffInDays > options.maxDays) {
            const error = { rangeTooLong: true };

            group.setErrors(error);

            return error;
        }

        return null;
    };
}
