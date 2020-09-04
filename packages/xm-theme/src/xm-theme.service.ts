import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { XmApplicationConfigService } from '../../../src/app/shared/spec';
import { ColorSchemeService } from './color-scheme.service';
import { StyleManagerService } from './style-manager.service';
import { ThemeColorService } from './theme-color.service';

export type THEME_STRATEGY = 'THEME' | 'TENANT_ONLY';

export interface ThemeOptions {
    theme?: string,
    themeColor?: string,
    themeDark?: string,
    themeStrategy?: THEME_STRATEGY
}

@Injectable({
    providedIn: 'root',
})
export class XmThemeService {
    private currentTheme: string;

    constructor(
        private styleManager: StyleManagerService,
        private colorSchemeService: ColorSchemeService,
        private themeColorService: ThemeColorService,
        private applicationConfigService: XmApplicationConfigService,
    ) {
    }

    public getTheme(): string | null {
        return this.currentTheme;
    }

    public set(theme: string | null, options?: ThemeOptions): Observable<void> {
        if (!theme) {
            this.styleManager.remove('theme');
            this.colorSchemeService.remove();
            this.themeColorService.remove();
            this.applicationConfigServiceBC();
            return of(undefined);
        }

        this.currentTheme = theme;

        if (options?.themeColor) {
            this.themeColorService.set(options.themeColor);
        }

        this.colorSchemeService.set(Boolean(options.themeDark), true);

        if (options?.themeStrategy === 'TENANT_ONLY') {
            return this.styleManager.setAsync('theme', `assets/css/${theme}.css`)
                .pipe(finalize(() => this.applicationConfigServiceBC()));
        } else {
            return this.styleManager.setAsync('theme', this.getUrl(theme))
                .pipe(finalize(() => this.applicationConfigServiceBC()));
        }
    }

    public getUrl(theme: string): string {
        return `/assets/themes/${theme}.css`;
    }

    /**
     * Backward compatibility
     */
    private applicationConfigServiceBC(): void {
        this.applicationConfigService.setResolved(true);
    }
}
