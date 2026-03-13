import { Translate } from '@xm-ngx/translation';
import { ByEntityQueryValueOptions } from './by-entity-query-value.interface';

export interface ByEntityQueryOptions extends ByEntityQueryValueOptions {
    title?: Translate;
    styleInline?: boolean;
}
