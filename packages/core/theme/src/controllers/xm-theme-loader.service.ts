import { APP_INITIALIZER, Injectable, Provider, StaticProvider } from '@angular/core';
import { MaintenanceService } from '@xm-ngx/components/maintenance';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { XmPublicUiConfigService } from '@xm-ngx/core';
import { XmThemeController } from './xm-theme-controller.service';
import { XmTheme } from '../interfaces/xm.theme';

export function themeInitializer(
    config: XmPublicUiConfigService<XmTheme>,
    themeService: XmThemeController,
    maintenanceService: MaintenanceService,
): () => Promise<void> {
    return (): Promise<void> => new XmThemeLoader(config, themeService, maintenanceService).tryLoadDefaultThemeFromConfig();
}

export const THEME_PROVIDER_FACTORY: StaticProvider = {
    provide: APP_INITIALIZER,
    useFactory: themeInitializer,
    deps: [XmPublicUiConfigService, XmThemeController, MaintenanceService],
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
    ) {
    }

    public tryLoadDefaultThemeFromConfig(): Promise<void> {
        return this.configService.config$().pipe(
            switchMap((c) => this.loadTheme(c)),
            take(1),
            catchError((err) => {
                this.maintenanceService.setMaintenanceProgress(true);
                return throwError(err);
            }),
        ).toPromise();
    }

    private loadTheme(rawOptions: Partial<XmTheme> & { theme?: string }): Observable<void> {
        const options: XmTheme = {
            name: rawOptions.name || rawOptions.theme || 'example',
            lightTheme: rawOptions.lightTheme || rawOptions.theme || 'example',
            darkTheme: rawOptions.darkTheme || rawOptions.theme || 'example-dark',
            themeColor: rawOptions.themeColor || '#009688',
            themeStrategy: rawOptions.themeStrategy || 'THEME',
            appearanceStrategy: rawOptions.appearanceStrategy || 'auto',
        };

        const existingTheme = this.themeManager.get();
        if (existingTheme != null) {
            return this.themeManager.set(existingTheme);
        }

        return this.themeManager.set(options);
    }
}
