import { IWithField } from './xm-table-filter-elastic';

export interface XmTableFiltersElasticStringQuery {
    [key: string]: (v: any, o: IWithField) => string
}
