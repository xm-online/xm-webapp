export type ThemeStrategy = 'THEME' | 'TENANT_ONLY';
export type AppearanceStrategy = 'light' | 'dark' | 'auto';

export interface XmTheme {
    name: string,
    lightTheme: string,
    darkTheme: string,
     themeColor: string | null,
    themeStrategy: ThemeStrategy,
    appearanceStrategy: AppearanceStrategy,
}
