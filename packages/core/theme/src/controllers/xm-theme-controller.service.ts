import { inject, Injectable, OnDestroy, Signal } from '@angular/core';
import { BehaviorSubject, map, Observable, of, Subscription } from 'rxjs';
import { ThemeSchemeService } from '../services/theme-scheme.service';
import { XmThemeStore } from '../stores/xm-theme-store.service';
import { ColorSchemeService } from '../services/color-scheme.service';
import { ThemeStrategy, XmTheme } from '../interfaces/xm.theme';
import { StyleManagerService } from '../services/style-manager.service';
import { ThemeColorService } from '../services/theme-color.service';
import { XmPublicUiConfigService } from '@xm-ngx/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root',
})
/**
 * Manages light and dark themes
 */
export class XmThemeController implements OnDestroy {
    private themeSchemeService: ThemeSchemeService = inject(ThemeSchemeService);
    private colorSchemeService: ColorSchemeService = inject(ThemeColorService);
    private themeStore: XmThemeStore = inject(XmThemeStore);
    private styleManager: StyleManagerService = inject(StyleManagerService);
    private themeColorService: ThemeColorService = inject(ThemeColorService);
    private configService: XmPublicUiConfigService<XmTheme> = inject(XmPublicUiConfigService<XmTheme>);

    private subscription: Subscription;
    private activeTheme: BehaviorSubject<XmTheme | null>;
    private isBrowserDark: boolean;
    public publicConfig: Signal<XmTheme> = toSignal<XmTheme>(this.configService.config$());


    constructor() {
        this.activeTheme = new BehaviorSubject<XmTheme | null>(this.themeStore.get());
        this.isBrowserDark = this.themeSchemeService.getBrowserTheme() == 'dark';
        this.observeBrowserThemeChanges();
    }

    private observeBrowserThemeChanges(): void {
        this.subscription = this.themeSchemeService.browserThemeChange$()
            .subscribe((e) => {
                this.isBrowserDark = e === 'dark';
                const theme = this.activeTheme.value;
                if (theme === null) {
                    return;
                }
                this.updateStyleTheme(theme);
            });
    }

    public activeTheme$(): Observable<XmTheme | null> {
        return this.activeTheme.asObservable();
    }

    public isDark$(): Observable<boolean> {
        return this.activeTheme$().pipe(
            map((_) => {
                return this.isBrowserDark;
            }),
        );
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public set(theme: XmTheme): Observable<void> {
        if (theme.darkTheme != theme.lightTheme) {
            this.colorSchemeService.set('dark light');
        } else {
            this.colorSchemeService.set('normal');
        }

        this.themeStore.set(theme);

        if (theme.themeColor) {
            this.themeColorService.set(theme.themeColor);
        }

        this.updateStyleTheme(theme);

        return of(undefined);
    }

    public get(): XmTheme | null {
        return this.activeTheme.value;
    }

    private updateStyleTheme(theme: XmTheme): void {
        const {appearanceStrategy, themeStrategy, darkTheme} = theme || {};

        let file = theme.lightTheme;
        const isThemeAllowDark = appearanceStrategy === 'dark' || appearanceStrategy == 'auto';
        const isThemeDark = appearanceStrategy === 'dark';
        if (isThemeAllowDark && (this.isBrowserDark || isThemeDark)) {
            file = darkTheme;
        }

        this.styleManager.set('theme', this.getThemeHref(themeStrategy, file));
        this.activeTheme.next(theme);
    }

    private getThemeHref(themeStrategy: ThemeStrategy, file: string): string {
        const defaultPath = `/assets/themes/${file}.css`;
        switch (themeStrategy) {
            case 'TENANT_ONLY':
                return `assets/css/${file}.css`;
            case 'CUSTOM':
                const {themePath} = this.publicConfig() || {};
                return themePath ? `${themePath}/${file}.css` : defaultPath;
            default:
                return defaultPath;
        }
    }
}
