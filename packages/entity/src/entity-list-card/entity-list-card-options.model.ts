import { ActionOptions, FieldOptions } from '@xm-ngx/core/config';
import { FastSearchSpec, XmEntity, XmEntitySpec } from '@xm-ngx/core/entity';

export { ActionOptions, FieldOptions } from '@xm-ngx/core/config';

export interface EntityListCardOptions {
    entities?: EntityOptions[];
    hideDelete?: boolean;
    hideAvatar?: boolean;
    useNewTable?: boolean;
    smOverflow?: boolean;
    hideExport?: boolean;
    hideOptionsMenu?: boolean;
    noDeepLink?: boolean;
    isShowFilterArea?: boolean;
}

export interface EntityOptions {
    typeKey?: string;
    query?: string;
    currentQuery?: string;
    name?: any;
    fastSearch?: FastSearchSpec[];
    hideDelete?: boolean;
    hideAvatar?: boolean;
    noDeepLink?: boolean;
    fields?: FieldOptions[];
    noData?: any;
    page?: number;
    xmEntitySpec?: XmEntitySpec;
    entities?: XmEntity[];
    totalItems?: any;
    queryCount?: any;
    routerLink?: string[];
    filter?: FilterOptions;
    filterJsfAttributes?: any;
    overrideCurrentQuery?: boolean;
}


/** @deprecated use ActionOptions instead */
export interface ActionsOptions extends ActionOptions {
    name?: any;
    className?: string;
    navigateByInnerUrl?: string;
    functionKey?: string;
    privilege?: string[] | string;
    handler?: (entity: XmEntity) => any;
    actionCondition?: (entity: XmEntity) => any;
}

export interface FilterOptions {
    template?: string;
    dataSpec?: string;
    dataForm?: string;
}
