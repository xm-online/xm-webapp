import { FastSearchSpec } from '../shared/fast-search-spec.model';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';
import { XmEntity } from '../shared/xm-entity.model';

export interface EntityListCardOptions {
    entities?: EntityOptions[];
    hideDelete?: boolean;
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

export interface FieldOptions {
    field?: string;
    title?: any;
    hiddenTitle?: boolean;
    useKeyword?: boolean;
    func?: string;
    action?: ActionOptions;
    actions?: ActionOptions[];
    actionsListPrivileges?: string[];
    sortable?: boolean;
}

export interface ActionOptions {
    name?: any;
    className?: string;
    navigateByInnerUrl?: string;
    functionKey?: string;
    privilege?: string[] | string;
    handler?: (entity: XmEntity) => any;
    actionCondition?: (entity: XmEntity) => any;
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
