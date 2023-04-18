import {
    booleanElastic,
    containsElastic,
    customFieldElastic,
    dateElastic,
    elasticQueryChips,
    entityElastic,
    entitySelectElastic,
    multiElastic,
    multiSelectElastic,
    nestedPropElastic,
    strictNumberElastic,
    strictNumberOrContainsStringElastic,
    strictStringElastic, templateElastic, userDelegationElastic,
    userFullnameElastic
} from './xm-table-filter-elastic';

export const TABLE_FILTERS_ELASTIC = {
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
