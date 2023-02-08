import { APP_INITIALIZER, Injectable, Provider, StaticProvider } from '@angular/core';
import { MaintenanceService } from '@xm-ngx/components/maintenance';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { XmPublicUiConfigService } from '@xm-ngx/core';
import { XmThemeController } from './xm-theme-controller.service';
import { XmTheme } from '../interfaces/xm.theme';
import { XmApplicationConfigService } from '@xm-ngx/core/config';

export function themeInitializer(
    config: XmPublicUiConfigService<XmTheme>,
    themeService: XmThemeController,
    maintenanceService: MaintenanceService,
    applicationConfigService: XmApplicationConfigService,
): () => Promise<void> {
    return (): Promise<void> => new XmThemeLoader(
        config,
        themeService,
        maintenanceService,
        applicationConfigService,
    ).tryLoadDefaultThemeFromConfig();
}

export const THEME_PROVIDER_FACTORY: StaticProvider = {
    provide: APP_INITIALIZER,
    useFactory: themeInitializer,
    deps: [XmPublicUiConfigService, XmThemeController, MaintenanceService, XmApplicationConfigService],
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
    constructor(
        private configService: XmPublicUiConfigService<XmTheme>,
        private themeManager: XmThemeController,
        private maintenanceService: MaintenanceService,
        private applicationConfigService: XmApplicationConfigService,
    ) {
    }

    public tryLoadDefaultThemeFromConfig(): Promise<void> {
        return this.configService.config$().pipe(
            switchMap((c) => this.loadTheme(c)),
            take(1),
            // TODO: WORKAROUND: Invert service import and provide guards for application start
            tap(() => this.applicationConfigService.setResolved(true)),
            catchError((err) => {
                this.maintenanceService.setMaintenanceProgress(true);
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
