import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
    name: 'xmEmpty',
    standalone: true,
})
export class XmEmptyPipe implements PipeTransform {
    public transform(value: any): boolean {
        return _.isEmpty(value);
    }

}