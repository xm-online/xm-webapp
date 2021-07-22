import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanLoad,
    Route,
    RouterStateSnapshot,
    Routes,
    UrlSegment,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export abstract class XmDynamicRouteResolverGuard implements CanLoad, CanActivate {
    public abstract getRoutes(): Routes | null;

    public abstract canActivate(route: ActivatedRouteSnapshot,
                                state: RouterStateSnapshot): Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree;

    public abstract canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree ;
}
