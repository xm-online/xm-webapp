import { FormControl, FormGroup } from '@angular/forms';
import { dateTimeRangeValidator } from '@xm-ngx/validators';

describe('dateTimeRangeValidator', () => {
    function buildForm(startDate: string, endDate: string, startTime?: string, endTime?: string) {
        const controls: any = {
            startDate: new FormControl(startDate),
            endDate: new FormControl(endDate),
        };

        if (startTime !== undefined) {
            controls.startTime = new FormControl(startTime);
        }

        if (endTime !== undefined) {
            controls.endTime = new FormControl(endTime);
        }

        return new FormGroup(controls);
    }

    it('should pass when startDate < endDate (no time)', () => {
        const form = buildForm('2025-01-01', '2025-01-02');

        const validator = dateTimeRangeValidator({
            startDateKey: 'startDate',
            endDateKey: 'endDate',
        });

        expect(validator(form)).toBeNull();
        expect(form.get('startDate')?.errors).toBeNull();
        expect(form.get('endDate')?.errors).toBeNull();
    });

    it('should fail when startDate > endDate (no time)', () => {
        const form = buildForm('2025-01-05', '2025-01-02');

        const validator = dateTimeRangeValidator({
            startDateKey: 'startDate',
            endDateKey: 'endDate',
        });

        const result = validator(form);
        expect(result).toEqual({ rangeInvalid: true });
        expect(form.get('startDate')?.errors).toEqual({ tooLate: true });
        expect(form.get('endDate')?.errors).toEqual({ tooEarly: true });
    });

    it('should pass when startDate + time < endDate + time', () => {
        const form = buildForm('2025-01-01', '2025-01-01', '10:00', '12:00');

        const validator = dateTimeRangeValidator({
            startDateKey: 'startDate',
            endDateKey: 'endDate',
            startTimeKey: 'startTime',
            endTimeKey: 'endTime',
        });

        expect(validator(form)).toBeNull();
    });

    it('should fail when startDate + time > endDate + time', () => {
        const form = buildForm('2025-01-01', '2025-01-01', '15:00', '10:00');

        const validator = dateTimeRangeValidator({
            startDateKey: 'startDate',
            endDateKey: 'endDate',
            startTimeKey: 'startTime',
            endTimeKey: 'endTime',
        });

        const result = validator(form);
        expect(result).toEqual({ rangeInvalid: true });
        expect(form.get('startDate')?.errors).toEqual({ tooLate: true });
        expect(form.get('endDate')?.errors).toEqual({ tooEarly: true });
    });

    it('should support case: startDate + startTime : endDate (no endTime)', () => {
        const form = buildForm('2025-01-01', '2025-01-01', '10:00');

        const validator = dateTimeRangeValidator({
            startDateKey: 'startDate',
            endDateKey: 'endDate',
            startTimeKey: 'startTime',
        });

        expect(validator(form)).toEqual({ rangeInvalid: true });
    });

    it('should ignore validation if one field is missing', () => {
        const form = buildForm(null, '2025-01-01');

        const validator = dateTimeRangeValidator({
            startDateKey: 'startDate',
            endDateKey: 'endDate',
        });

        expect(validator(form)).toBeNull();
    });
});
