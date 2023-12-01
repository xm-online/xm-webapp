export interface HistoryEvent {
    user: string;
    date: Date;
    config: string;
    version?: number;
}

export interface AuditResponse {
    content: AuditContent[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: string;
    size: number;
    sort: {
        unsorted: boolean;
        sorted: boolean;
        empty: boolean;
    };
    totalElements: number;
    totalPages: number;
}
export interface AuditContent {
    audit: { config: object; layout: object; widgets: { id: number; name: string; selector: string; config: object }[] };
    revInfo: { lastModifiedBy: string; revtstmp: Date; rev: number };
    operation: 'ADD' | 'MOD';
}

export interface HistoryModalConfig {
    itemType: 'dashboard' | 'widget';
    itemName: string;
    changesType: 'config' | 'layout';
}
export interface HistoryModalData {
    events: HistoryEvent[];
    config: HistoryModalConfig;
}
