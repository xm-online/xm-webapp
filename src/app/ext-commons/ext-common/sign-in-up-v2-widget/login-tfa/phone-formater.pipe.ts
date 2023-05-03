import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phoneFormatter',
    standalone: true,
})
export class PhoneFormatterPipe implements PipeTransform {
    public transform(value: string): string {
        if (!value) {
            return '';
        }
        // Remove non-numeric characters
        const cleanedValue = value.replace(/\D/g, '');
        // Check if the phone number has the correct length
        if (cleanedValue.length !== 12) {
            return value;
        }
        // Format the phone number
        const formattedNumber = [
            cleanedValue.slice(0, 2),
            cleanedValue.slice(2, 5),
            cleanedValue.slice(5, 8),
            cleanedValue.slice(8, 10),
            cleanedValue.slice(10, 12),
        ].join('-');
        return `+${formattedNumber}`;
    }

}
