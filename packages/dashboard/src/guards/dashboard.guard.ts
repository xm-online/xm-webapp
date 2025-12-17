import { inject, Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
// import { environment } from '@xm-ngx/core/environment';
import { XmLogger, XmLoggerService } from '@xm-ngx/logger';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DashboardStore, DashboardWithWidgets, XmCanActivate } from '@xm-ngx/core/dashboard';
import { DefaultDashboardService } from '../services/default-dashboard.service';
import { XmDynamicControllerDeclaration, XmDynamicControllerInjectorFactoryService, XmDynamicInjectionTokenStoreService } from '@xm-ngx/dynamic';

@Injectable({
    providedIn: 'root',
})
export class DashboardGuard implements CanActivate, CanActivateChild {

    private logger: XmLogger;
    private dynamicControllerInjectorFactory = inject(XmDynamicControllerInjectorFactoryService);
    private dynamicInjectionTokenStoreService = inject(XmDynamicInjectionTokenStoreService);
    private injector = inject(Injector);

    constructor(
        private dashboardWrapperService: DashboardStore,
        private defaultDashboardService: DefaultDashboardService,
        loggerService: XmLoggerService,
        private router: Router,
    ) {
        this.logger = loggerService.create({ name: 'DashboardGuard' });
    }

    public canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this.resolve(next);
    }

    public canActivateChild(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this.resolve(next);
    }

    public resolve(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        const idOrSlug = next.data?.dashboard?.id || null;
        return this.dashboardWrapperService.getByIdOrSlug(idOrSlug).pipe(
            switchMap((dashboard) => {
                return dashboard?.config?.canActivateGuards
                    ? from(this.resolveCustomGuard(dashboard, next))
                    : of(!!dashboard);
            }),
            switchMap((available) => {
                if (available) {
                    return of(available);
                }
                if (idOrSlug) {
                    this.logger.warn(`The dashboard by the "${idOrSlug}" slag is not available. `
                        + 'A probable reason for this is an active user don\'t have the permission'
                        + 'or didn\'t pass canActivateGuards checks if they configured'
                        + 'or this dashboard do not exist.');
                }
                return this.getFirstAvailableDashboard();
            })
        );
    }


    /*
    * Added an extension point for implementing route guards
    *
    * How to define a custom route guard:
    * 1. In the dashboard configuration, add the guard config to canActivateGuards,
    *   for example:
    *   "canActivateGuards": [{
    *       "key": "canActivatePage",
    *       "selector": "path-to-implementation"
    *   }]
    *
    * 2. The service must implement the XmCanActivate interface.
    *
    * */
    private async resolveCustomGuard(value: DashboardWithWidgets, next: ActivatedRouteSnapshot): Promise<boolean> {
        if (!value) {
            return false;
        }
        const { canActivateGuards } = value.config;

        if (canActivateGuards?.length === 0) {
            return true;
        }

        const canActivateInjector = this.dynamicControllerInjectorFactory.defineProviders(canActivateGuards as XmDynamicControllerDeclaration[], [], this.injector);

        for(const { key } of canActivateGuards) {
            const token = this.dynamicInjectionTokenStoreService.resolve(key);
            const guard = (await canActivateInjector).get<XmCanActivate>(token);
            if (guard && !guard.canActivate(value, next)) {
                return false;
            }
        }
        return true;
    }

    private getFirstAvailableDashboard(): Observable<UrlTree> {
        return this.defaultDashboardService.getDefaultOrFirstAvailable().pipe(
            map((d) => {
                const newUrl = d ? `/dashboard/${d.config?.slug || d.id}` : '/not-found';
                this.logger.info(`Redirect router.url=${this.router.url}, newUrl=${newUrl}`);
                return this.router.parseUrl(newUrl);
            }),
        );
    }

}
