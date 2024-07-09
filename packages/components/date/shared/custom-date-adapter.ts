import { NativeDateAdapter } from '@angular/material/core';
import dayjs from 'dayjs';

export class CustomDateAdapter extends NativeDateAdapter {
    public parse(value: any): Date | null {
        if (typeof value === 'string' && value.indexOf('.') > -1) {
            const str = dayjs(value).format('DD.MM.YYYY');
            return new Date(Date.parse(str));
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

    public format(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    public getFirstDayOfWeek(): number {
        return 1; // Monday
    }
}
