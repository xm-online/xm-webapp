import { APP_INITIALIZER, Injectable, Provider, StaticProvider } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { XmPublicUiConfigService } from '@xm-ngx/core';
import { XmThemeController } from './xm-theme-controller.service';
import { XmTheme } from '../interfaces/xm.theme';
import { XmApplicationConfigService } from '@xm-ngx/core/config';

export function themeInitializer(
    config: XmPublicUiConfigService<XmTheme>,
    themeService: XmThemeController,
): () => Promise<void> {
    return (): Promise<void> => new XmThemeLoader(
        config,
        themeService,
    ).tryLoadDefaultThemeFromConfig();
}

export const THEME_PROVIDER_FACTORY: StaticProvider = {
    provide: APP_INITIALIZER,
    useFactory: themeInitializer,
    deps: [XmPublicUiConfigService, XmThemeController, XmApplicationConfigService],
    multi: true,
};

export function themeInitializerFactory(): Provider[] {
    return [THEME_PROVIDER_FACTORY];
}

@Injectable()
/**
 * Applies a theme from configs
 * @beta
 */
export class XmThemeLoader {
    public loaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private configService: XmPublicUiConfigService<XmTheme>,
        private themeManager: XmThemeController
    ) {
    }

    public tryLoadDefaultThemeFromConfig(): Promise<void> {
        this.loaded$.next(false);
        return this.configService.config$().pipe(
            switchMap((c) => this.loadTheme(c)),
            take(1),
            tap(() => this.loaded$.next(false)),
            catchError((err) => {
                this.loaded$.error(err);
                return throwError(err);
            }),
        ).toPromise();
    }

    private loadTheme(rawOptions: Partial<XmTheme> & { theme?: string }): Observable<void> {
        let theme: XmTheme | null;

        // Local storage theme
        if (this.themeManager.get()) {
            theme = this.themeManager.get();
        }
        // Config theme
        else if (rawOptions.theme != null) {
            theme = {
                name: rawOptions.theme,
                lightTheme: rawOptions.lightTheme || rawOptions.theme,
                darkTheme: rawOptions.darkTheme || rawOptions.theme,
                themeColor: rawOptions.themeColor || null,
                themeStrategy: rawOptions.themeStrategy || 'THEME',
                appearanceStrategy: rawOptions.appearanceStrategy || 'auto',
            };
        }

        if (theme == null) {
            return of(undefined);
        }

        return this.themeManager.set(theme);
    }
}
