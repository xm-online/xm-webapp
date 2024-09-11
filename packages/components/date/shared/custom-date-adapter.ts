import { NativeDateAdapter } from '@angular/material/core';
import dayjs from 'dayjs';

export class CustomDateAdapter extends NativeDateAdapter {
    public mondayIndex: number = 1;

    public parse(value: any): Date | null {
        if (typeof value === 'string' && value.indexOf('.') > -1) {
            return dayjs(value, 'DD.MM.YYYY').toDate();
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
        return this.mondayIndex;
    }
}
