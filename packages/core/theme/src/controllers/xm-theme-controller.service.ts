import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, Observable, of, Subscription } from 'rxjs';
import { ThemeSchemeService } from '../services/theme-scheme.service';
import { XmThemeStore } from '../stores/xm-theme-store.service';
import { ColorSchemeService } from '../services/color-scheme.service';
import { XmTheme } from '../interfaces/xm.theme';
import { StyleManagerService } from '../services/style-manager.service';
import { ThemeColorService } from '../services/theme-color.service';

@Injectable({
    providedIn: 'root',
})
/**
 * Manages light and dark themes
 */
export class XmThemeController implements OnDestroy {
    private subscription: Subscription;

    private activeTheme: BehaviorSubject<XmTheme | null>;
    private isBrowserDark: boolean;

    constructor(
        private themeSchemeService: ThemeSchemeService,
        private colorSchemeService: ColorSchemeService,
        private themeStore: XmThemeStore,
        private styleManager: StyleManagerService,
        private themeColorService: ThemeColorService,
    ) {
        this.activeTheme = new BehaviorSubject<XmTheme | null>(this.themeStore.get());
        this.isBrowserDark = this.themeSchemeService.getBrowserTheme() == 'dark';

        this.subscription = this.themeSchemeService.browserThemeChange$()
            .subscribe((e) => {
                if (e === 'dark') {
                    this.isBrowserDark = true;
                } else {
                    this.isBrowserDark = false;
                }
                const theme = this.activeTheme.value;
                if (theme == null) {
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
        let file = theme.lightTheme;
        const isThemeAllowDark = theme.appearanceStrategy == 'dark' || theme.appearanceStrategy == 'auto';
        const isThemeDark = theme.appearanceStrategy == 'dark';
        if (isThemeAllowDark && (this.isBrowserDark || isThemeDark)) {
            file = theme.darkTheme;
        }

        if (theme.themeStrategy === 'TENANT_ONLY') {
            this.styleManager.set('theme', `assets/css/${file}.css`);
        } else {
            this.styleManager.set('theme', `/assets/themes/${file}.css`);
        }

        this.activeTheme.next(theme);
    }
}
