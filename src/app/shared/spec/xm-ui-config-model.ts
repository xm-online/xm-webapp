import { FieldOptions } from '../../xm-entity/entity-list-card/entity-list-card-options.model';

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
}

export interface IIdpConfig {
    clients?: IIdpClient[];
    features?: {
        directLogin?: {
            enabled?: boolean;
            defaultClientKey?: string;
        };
    }
}

export interface IIdpClient {
    clientId?: string;
    features: unknown;
    key: string;
    name: string;
    icon?: {
        class?: string;
        name?: string;
        src?: string;
        style?: string;
    }
    openIdConfig: IOpenIdConfig;
    redirectUri: string;
}

export interface IOpenIdConfig {
    authorizationEndpoint: {
        uri: string;
    };
    responseType?: string;
    additionalParams?: unknown;
    features?: unknown;
    endSessionEndpoint: {
        uri: string;
    };
    issuer?: string;
}
