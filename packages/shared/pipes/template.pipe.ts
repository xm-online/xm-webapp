import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { Primitive } from '../interfaces';

@Pipe({
    name: 'template',
    standalone: true,
})
export class XmTemplatePipe implements PipeTransform {
    public transform(value: Primitive, template?: string): Primitive {
        if (template == null) {
            return value;
        }

        try {
            return _.template(template)(_.isObject(value) ? value : { value });
        } catch (error) {
            return value;
        }
    }

}