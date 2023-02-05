import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { ThemeSchemeService } from '../services/theme-scheme.service';
import { XmThemeStore } from '../stores/xm-theme-store.service';
import { ColorSchemeService } from '../services/color-scheme.service';
import { XmTheme } from '../interfaces/xm.theme';
import { map } from 'rxjs';
import { StyleManagerService } from '../services/style-manager.service';
import { ThemeColorService } from '../services/theme-color.service';
import { XmApplicationConfigService } from '@xm-ngx/core/config';

@Injectable({
    providedIn: 'root',
})
/**
 * Manages light and dark themes
 * @beta
 */
export class XmThemeController implements OnDestroy {
    private subscription: Subscription;

    private activeTheme: BehaviorSubject<XmTheme | null>;
    private isDark: boolean;

    constructor(
        private themeSchemeService: ThemeSchemeService,
        private colorSchemeService: ColorSchemeService,
        private themeStore: XmThemeStore,
        private styleManager: StyleManagerService,
        private themeColorService: ThemeColorService,
        private applicationConfigService: XmApplicationConfigService,
    ) {
        this.activeTheme = new BehaviorSubject<XmTheme | null>(this.themeStore.get());
        this.isDark = this.themeSchemeService.getBrowserTheme() == 'dark';

        this.subscription = this.themeSchemeService.browserThemeChange$()
            .subscribe((e) => {
                if (e === 'dark') {
                    this.isDark = true;
                }
                this.isDark = false;
                this.updateStyleTheme(this.activeTheme.value);
            });
    }

    public activeTheme$(): Observable<XmTheme | null> {
        return this.activeTheme.asObservable();
    }

    public isDark$(): Observable<boolean> {
        return this.activeTheme$().pipe(
            map((_) => {
                return this.isDark;
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

    public get(): XmTheme {
        return this.activeTheme.value;
    }

    private updateStyleTheme(theme: XmTheme): void {
        let file = theme.lightTheme;
        if (this.isDark || theme.appearanceStrategy == 'dark') {
            file = theme.darkTheme;
        }

        if (theme.themeStrategy === 'TENANT_ONLY') {
            this.styleManager.set('theme', `assets/css/${file}.css`);
            this.applicationConfigServiceBC();
        }

        this.styleManager.set('theme', this.getUrl(file));
        this.applicationConfigServiceBC();
        this.activeTheme.next(theme);
    }

    private getUrl(theme: string): string {
        return `/assets/themes/${theme}.css`;
    }

    /**
     * Backward compatibility
     */
    private applicationConfigServiceBC(): void {
        this.applicationConfigService.setResolved(true);
    }
}
