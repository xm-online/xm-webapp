import { NativeDateAdapter } from '@angular/material/core';

export class CustomDateAdapter extends NativeDateAdapter {
    public parse(value: any): Date | null {
        if (typeof value === 'string' && value.indexOf('.') > -1) {
            const str = value.split('.');
            const day = Number(str[0]);
            const month = Number(str[1]) - 1;
            const year = Number(str[2]);
            return new Date(year, month, day);
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
}
