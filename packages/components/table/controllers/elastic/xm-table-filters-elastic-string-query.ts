import {
    booleanElastic,
    containsElastic,
    customFieldElastic,
    dateElastic,
    elasticQueryChips,
    entityElastic,
    entitySelectElastic,
    IWithField,
    multiElastic,
    multiSelectElastic,
    nestedPropElastic,
    strictNumberElastic,
    strictNumberOrContainsStringElastic,
    strictStringElastic,
    templateElastic,
    userDelegationElastic,
    userFullnameElastic,
} from './xm-table-filter-elastic';

export interface XmTableFiltersElasticStringQuery {
    [key: string]: (v: any, o: IWithField) => string
}

export const Xm_TABLE_FILTERS_ELASTIC_STRING_QUERY: XmTableFiltersElasticStringQuery = {
    default: containsElastic,
    nestedProp: nestedPropElastic,
    link: strictNumberOrContainsStringElastic,
    date: dateElastic,
    boolean: booleanElastic,
    strictNumber: strictNumberElastic,
    entity: entityElastic,
    entitySelect: entitySelectElastic,
    enum: strictStringElastic,
    multiElastic: multiElastic,
    multiSelectElastic: multiSelectElastic,
    userFullname: userFullnameElastic,
    customField: customFieldElastic,
    template: templateElastic,
    userDelegation: userDelegationElastic,
    linkCategory: containsElastic,
    chips: elasticQueryChips,
    '': containsElastic,
};

export type ElasticType = keyof typeof Xm_TABLE_FILTERS_ELASTIC_STRING_QUERY;
