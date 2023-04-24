import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, CanLoad, Routes } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export abstract class XmDynamicRouteResolverGuard implements CanLoad, CanActivate, CanDeactivate<unknown> {
    public abstract getRoutes(): Routes | null ;

    public abstract canActivate(route: ActivatedRouteSnapshot): Observable<boolean> ;

    public abstract canDeactivate(_: unknown, route: ActivatedRouteSnapshot): Observable<boolean> ;

    public abstract canLoad(): Observable<boolean> ;
}
