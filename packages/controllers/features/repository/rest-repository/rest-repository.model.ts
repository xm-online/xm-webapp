export type RestResourceConfig = {
    resource: ResourceConfig;
    byType: {
        create: ResourceConfig;
        read: ResourceConfig;
        update: ResourceConfig;
        delete: ResourceConfig;
    }
}

export type ResourceConfig = {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
    body?: Record<string, string>;
}

