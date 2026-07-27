import { XmUIConfig } from '@xm-ngx/core/config';

export type ThemeStrategy = 'THEME' | 'TENANT_ONLY' | 'CUSTOM';
export type AppearanceStrategy = 'light' | 'dark' | 'auto';

export interface XmTheme extends XmUIConfig {
    name: string;
    lightTheme: string;
    darkTheme: string;
    themeColor: string | null;
    themeStrategy: ThemeStrategy;
    appearanceStrategy: AppearanceStrategy;
    themePath?: string;
}
