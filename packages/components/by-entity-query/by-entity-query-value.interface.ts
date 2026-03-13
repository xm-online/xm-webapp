export interface ByEntityQueryValueOptions {
    resourceUrl: string;
    searchField: string;
    displayField: string;
    extraParams?: Record<string, unknown>;
    searchUrl?: string;
    queryTemplate?: string;
    searchSize?: number;
}
