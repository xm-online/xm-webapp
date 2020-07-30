import { APP_INITIALIZER, Injectable, Provider, StaticProvider } from '@angular/core';
import { MaintenanceService } from '@xm-ngx/components/maintenance';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { XmPublicUiConfigService } from '../../core/src/config/xm-public-ui-config.service';
import { THEME_STRATEGY, XmThemeService } from './xm-theme.service';

export function themeInitializer(
    config: XmPublicUiConfigService,
    themeService: XmThemeService,
    maintenanceService: MaintenanceService,
): () => Promise<void> {
    return (): Promise<void> => new ThemeLoader(config, themeService, maintenanceService).loadThemeFromConfig();
}

export const THEME_PROVIDER_FACTORY: StaticProvider = {
    provide: APP_INITIALIZER,
    useFactory: themeInitializer,
    deps: [XmPublicUiConfigService, XmThemeService, MaintenanceService],
    multi: true,
};

export function themeInitializerFactory(): Provider[] {
    return [THEME_PROVIDER_FACTORY];
}

@Injectable()
export class ThemeLoader {
    constructor(
        private configService: XmPublicUiConfigService<{ theme?: string; themeStrategy?: THEME_STRATEGY }>,
        private themeService: XmThemeService,
        private maintenanceService: MaintenanceService,
    ) {
    }

    public loadThemeFromConfig(): Promise<void> {
        return this.configService.config$().pipe(
            switchMap((c) => this.loadTheme(c.theme, c.themeStrategy)),
            take(1),
            catchError((err) => {
                this.maintenanceService.setMaintenanceProgress(true);
                return throwError(err);
            }),
        ).toPromise();
    }

    private loadTheme(theme?: string, strategy?: THEME_STRATEGY): Observable<void> {
        return this.themeService.set(theme, strategy);
    }
}
