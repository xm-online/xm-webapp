import { transformByMap } from './transform-by-map';
import { format } from './format';

export interface FormatWithConfigOptions {
    format?: unknown,
    format2?: unknown
}

export function formatWithConfig<T>(data: unknown, config: FormatWithConfigOptions): T {
    if (config?.format) {
        return transformByMap(data, config.format);
    } else if (config?.format2) {
        return format<T>(config.format2, data);
    }
    return data as T;
}
