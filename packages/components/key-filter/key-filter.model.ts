import { XmKeyFilterConfig, XmKeyFilterValue } from '@xm-ngx/components/key-filter/key-filter.component';

export interface KeyFilterController {
    prepareValue?: (value: XmKeyFilterValue, config: XmKeyFilterConfig) => XmKeyFilterValue;
}
