import { Pipe, PipeTransform } from '@angular/core';
import { get } from 'lodash';

@Pipe({
    name: 'valueFromSignal',
    standalone: true,
})
export class ValueFromSignalPipe implements PipeTransform {
    public transform<T>(value: string, field: string): T {
        return get(value, field) as T;
    }
}
