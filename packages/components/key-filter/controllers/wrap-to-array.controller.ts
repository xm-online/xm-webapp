import { Injectable } from '@angular/core';
import {
    KeyFilterController,
    XmKeyFilterConfig,
    XmKeyFilterValue,
} from '../key-filter.model';
import { isArray } from 'lodash';

/**
 * Controller that wraps non-array values into an array with a single element.
 * This ensures that searchNestedByPredicate always receives array input.
 */
@Injectable()
export class WrapToArrayController implements KeyFilterController {

    public prepareValue(value: XmKeyFilterValue, _config: XmKeyFilterConfig): XmKeyFilterValue {
        // If already an array, return as-is
        if (isArray(value)) {
            return value;
        }

        // Wrap non-array value in an array
        return [value];
    }
}

