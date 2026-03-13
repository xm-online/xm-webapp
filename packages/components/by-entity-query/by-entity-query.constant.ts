import { ByEntityQueryOptions } from './by-entity-query.interface';
import { BY_ENTITY_QUERY_VALUE_OPTIONS } from './by-entity-query-value.constant';

export const BY_ENTITY_QUERY_OPTIONS: ByEntityQueryOptions = {
    ...BY_ENTITY_QUERY_VALUE_OPTIONS,
    styleInline: false,
};
