import { Injectable } from '@angular/core';
import {
    KeyFilterController,
    XmKeyFilterConfig,
    XmKeyFilterValue, 
} from '../key-filter.model';
import { has } from 'lodash';

@Injectable()
export class FilterByPropertyPathController implements KeyFilterController {

    public prepareValue(value: XmKeyFilterValue, config: XmKeyFilterConfig): XmKeyFilterValue {
        const { propertyPath } = config;

        if (propertyPath) {
            return this.filterByPropertyPath(value, propertyPath);
        }
        return value;
    }

    public filterByPropertyPath(data: unknown[], path: string): unknown[] {
        return data.filter(item => has(item, path));
    }
}
