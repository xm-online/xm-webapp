export interface ByEntityQueryValueOptions {
    resourceUrl: string;
    searchField: string;
    displayField: string;
    /**
     * Optional template string to build a custom display value from multiple entity fields.
     * Use `{{fieldPath}}` placeholders to reference entity properties (supports dot-notation).
     *
     */
    displayCustomField?: string;
    extraParams?: Record<string, unknown>;
    searchUrl?: string;
    queryTemplate?: string;
    searchSize?: number;
}
