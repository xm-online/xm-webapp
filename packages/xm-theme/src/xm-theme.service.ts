import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { XmApplicationConfigService } from '../../../src/app/shared/spec';
import { StyleManagerService } from './style-manager.service';

export type THEME_STRATEGY = 'THEME' | 'TENANT_ONLY';

@Injectable({
    providedIn: 'root',
})
export class XmThemeService {
    private currentTheme: string;

    constructor(
        private styleManager: StyleManagerService,
        private applicationConfigService: XmApplicationConfigService,
    ) {
    }

    public getTheme(): string | null {
        return this.currentTheme;
    }

    public set(theme: string | null, strategy: THEME_STRATEGY): Observable<void> {
        if (!theme) {
            this.styleManager.remove('theme');
            this.applicationConfigServiceBC();
            return of(undefined);
        }

        this.currentTheme = theme;

        if (strategy === 'TENANT_ONLY') {
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
