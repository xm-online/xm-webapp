import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { environment } from '@xm-ngx/core/environment';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DashboardWrapperService } from './shared/dashboard-wrapper.service';
import { DefaultDashboardService } from './shared/default-dashboard.service';

@Injectable({
    providedIn: 'root',
})
export class DashboardGuard implements CanActivate, CanActivateChild {

    constructor(
        private dashboardWrapperService: DashboardWrapperService,
        private defaultDashboardService: DefaultDashboardService,
        private router: Router,
    ) {
    }

    public canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this.resolve(next.params.id);
    }

    public canActivateChild(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this.resolve(next.params.id);
    }

    public resolve(idOrSlug: number | string | null): Observable<boolean | UrlTree> {
        return this.isDashboardAvailable(idOrSlug).pipe(
            switchMap((available) => {
                if (available) {
                    return of(available);
                } else if (idOrSlug) {
                    console.warn(`The dashboard by the "${idOrSlug}" slag is not available. `
                        + 'A probable reason for this is an active user don\'t have the permission '
                        + 'or this dashboard do not exist.');
                }
                return this.getFirstAvailableDashboard();
            }));
    }

    private isDashboardAvailable(idOrSlug: number | string): Observable<boolean> {
        return this.dashboardWrapperService.getByIdOrSlug(idOrSlug).pipe(map(Boolean));
    }

    private getFirstAvailableDashboard(): Observable<UrlTree> {
        return this.defaultDashboardService.getDefaultOrFirstAvailable().pipe(
            map((d) => {
                const newUrl = d ? `/dashboard/${d.config?.slug || d.id}` : environment.notFoundUrl;
                console.info(`DashboardGuard redirect to ${newUrl}`);
                return this.router.parseUrl(newUrl);
            }),
        );
    }

}
