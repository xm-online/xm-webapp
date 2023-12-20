import { Pipe, PipeTransform } from '@angular/core';
import { isEmpty, isNumber, isNaN } from 'lodash';

// see: https://github.com/lodash/lodash/issues/496
export function checkIfEmpty(value: any): boolean {
    return isEmpty(value) && !isNumber(value) || isNaN(value);
}

@Pipe({
    name: 'xmEmpty',
    standalone: true,
})
export class XmEmptyPipe implements PipeTransform {
    public transform(value: any): boolean {
        return checkIfEmpty(value);
    }
}

@Pipe({
    name: 'xmNotEmpty',
    standalone: true,
})
export class XmNotEmptyPipe implements PipeTransform {
    public transform(value: any): boolean {
        return !checkIfEmpty(value);
    }
}