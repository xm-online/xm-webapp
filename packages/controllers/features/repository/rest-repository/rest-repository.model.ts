export type RestResourceConfig = {
    resource: {
        url: string;
        method?: string;
        headers?: Record<string, string>;
        queryParams?: Record<string, string>;
        body?: Record<string, string>;
    }
}

