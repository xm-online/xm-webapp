import { Translate } from '@xm-ngx/translation';

export type XmTableExportButtonControllerConfig = {
    dataController?: {
        key: string;
        method?: {
            get?: string;
            forceReload?: string;
        };
    },
    toaster?: {
        update: Translate
    }
    triggerTableKey?: string;
    format?: unknown;
    format2?: unknown;
    formatRequest?: Record<string, unknown>;
    formatRequestWithDefaultValue?: boolean;
}

export const XmTableExportButtonControllerConfigDefault = {
    triggerTableKey: 'action',
    dataController: {
        key: 'collection',
        method: {
            get: 'export'
        }
    }
};
