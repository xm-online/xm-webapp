export interface FieldOptions {
    field?: string;
    title?: any;
    hiddenTitle?: boolean;
    useKeyword?: boolean;
    dateFormat?: string;
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
    handler?: (entity: any) => any;
    actionCondition?: (entity: any) => any;
}

export class TranslationSet {
    [language: string]: string;
}

export type AttachmentsView = 'list' | '';

export interface EntityAttachmentsUiConfig {
    view: AttachmentsView;
    noData: TranslationSet;
}

export interface EntityLocationsUiConfig {
    noData: TranslationSet;
}

export interface EntityLinkUiConfig {
    typeKey: string;
    hideIfEmpty: boolean;
    noData: TranslationSet;
    fields: FieldOptions[];
}

export interface EntityCalendarUiConfig {
    typeKey: string;
    queryPageSize: number;
    view: CalendarView;
}

export type CalendarView = 'month' | 'week' | 'day';

export type EntityDetailLayout = 'DEFAULT' | 'ALL-IN-ROW' | 'COMPACT';
export type EntityDetailDisplayMode = 'HEAD' | 'BODY' | 'BOTH';

export interface EntityUiConfig {
    typeKey: string;
    addButtonPermission?: string;
    editButtonPermission?: string;
    detailLayoutType: EntityDetailLayout;
    fields?: FieldOptions[]; // TODO: FieldOptions is a UI config item. It can be moved here to keep all in one place.
    attachments?: EntityAttachmentsUiConfig;
    locations?: EntityLocationsUiConfig;
    links?: { items: EntityLinkUiConfig[] };
    calendars?: { items: EntityCalendarUiConfig[] };
    noData?: TranslationSet;
    displayMode?: EntityDetailDisplayMode;
}
