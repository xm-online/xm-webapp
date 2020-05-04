import { Injectable } from '@angular/core';
import { RequestCache, RequestCacheFactoryService } from '@xm-ngx/core';

import { from, iif, Observable, of } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Dashboard } from './dashboard.model';
import { DashboardService } from './dashboard.service';

@Injectable()
export class DashboardWrapperService {

    private promise: Promise<Dashboard[]>;
    private _dashboards: Dashboard[];
    private requestCache: RequestCache<Dashboard[]>;

    constructor(private cacheFactoryService: RequestCacheFactoryService,
                private dashboardService: DashboardService) {
        this.requestCache = this.cacheFactoryService.create<Dashboard[]>({
            request: () => this.dashboardService.query().pipe(pluck('body')),
            onlyWithUserSession: true,
        });
    }

    public dashboards$(): Observable<Dashboard[] | null> {
        return this.requestCache.get();
    }

    public getBySlug(slug: string): Observable<Dashboard | null> {
        return this.dashboards$().pipe(
            map<Dashboard[] | null, Dashboard[]>((ds) => ds || []),
            map((ds) => ds.find((d) => (d.config && d.config.slug === slug))),
        );
    }

    public getById(id: number): Observable<Dashboard | null> {
        return this.dashboards$().pipe(
            map<Dashboard[] | null, Dashboard[]>((ds) => ds || []),
            map((ds) => ds.find((d) => (d.id === id))),
        );
    }

    // tslint:disable-next-line:cognitive-complexity
    /** @deprecated Use dashboards$ instead */
    public dashboards(force: boolean = false, mockDashboards: boolean = false): Promise<Dashboard[]> {
        if (!environment.production) { console.info(`DBG Get dashboards: ${force}`); }
        if (!force && this.promise) {
            return this.promise;
        } else {
            return this.promise = new Promise((resolve, reject) => {
                if (force === true) {
                    this._dashboards = undefined;
                }

                // check and see if we have retrieved the dashboards data from the server.
                // if we have, reuse it by immediately resolving
                if (this._dashboards) {
                    this.promise = null;
                    resolve(this._dashboards);
                    return;
                }

                // retrieve the dashboards data from the server, update the dashboardList object, and then resolve.
                this.dashboardService.query().toPromise().then((dashboardList) => {
                    this.promise = null;
                    if (dashboardList.body) {
                        this._dashboards = dashboardList.body;
                    } else {
                        this._dashboards = null;
                    }
                    resolve(this._dashboards);
                }).catch((err) => {
                    this.promise = null;
                    if (mockDashboards) {
                        this._dashboards = [];
                        resolve(this._dashboards);
                    } else {
                        this._dashboards = null;
                        throw (err);
                    }
                });
            });
        }
    }

    /** @deprecated getBySlug or getById instead */
    public getDashboardByIdOrSlug(idOrSlug: number | string,
                                  force: boolean = false): Observable<Dashboard | undefined> {

        const predicate = (d: Dashboard) => (d.config && d.config.slug === idOrSlug) ||
            d.id === parseInt(idOrSlug as string, 10);

        const getDash = (dashboards: Dashboard[]) => dashboards.filter(predicate).shift();

        // if present, use existing
        if (!force && this._dashboards && this._dashboards.length) {
            return of(getDash(this._dashboards));
        }

        // else, get dashboards and process result
        return from(this.dashboards(force))
            .pipe(
                mergeMap((dashboards) => iif(
                    () => dashboards && dashboards.length > 0,
                    of(getDash(dashboards)),
                    of(getDash([]))),
                ));

    }
}
