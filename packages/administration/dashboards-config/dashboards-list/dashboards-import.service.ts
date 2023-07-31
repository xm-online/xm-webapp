import { Injectable } from '@angular/core';
import { DASHBOARDS_TRANSLATES } from '../const';
import { XmAlertService } from '@xm-ngx/alert';
import { Dashboard, DashboardService, DashboardWidget, DashboardWithWidgets } from '@xm-ngx/core/dashboard';
import * as _ from 'lodash';
import { BehaviorSubject, concat, forkJoin, lastValueFrom, Observable, throwError } from 'rxjs';
import { concatAll, exhaustMap, finalize, map, switchMap, tap, filter, shareReplay, catchError } from 'rxjs/operators';
import { DashboardCollection, WidgetCollection } from '../injectors';
import { DashboardsExport } from './dashboards-export.service';
import { XmToasterService } from '@xm-ngx/toaster';

@Injectable()
export class DashboardsImportService {

    public loading$: Observable<boolean>;
    protected loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private confirmRemoval: Observable<boolean>;

    constructor(
        protected readonly dashboardService: DashboardCollection,
        public dashboard: DashboardService,
        protected readonly widgetService: WidgetCollection,
        private toasterServie: XmToasterService,
        protected readonly alertService: XmAlertService,
    ) {
        this.loading$ = this.loader.asObservable();
    }

    public import(file: File): Observable<void> {
        this.loader.next(true);

        this.confirmRemoval = this.alertService.yesNo({text: DASHBOARDS_TRANSLATES.deleted}).pipe(
            map(data => data.isConfirmed),
            shareReplay(1)
        );

        return this.loadFile(file).pipe(
            switchMap(json => {
                return concat([
                    this.createNewDashboards(json),
                    this.updateExistingDashboards(json)
                ]).pipe(concatAll());
            }),
            tap(async () => {
                await lastValueFrom(this.toasterServie.create({
                    timeout: 1500,
                    text: 'Success',
                    type: 'success',
                }));
            }),
            finalize(() => this.loader.next(false)),
        );
    }

    private createNewDashboards(json: DashboardsExport): Observable<void> {
        return this.confirmRemoval.pipe(
            filter(removeConfirmed => removeConfirmed == true),
            switchMap(() => {
                return forkJoin({
                    dashboards: this.dashboardService.getAll(),
                    widgets: this.widgetService.getAll()
                }).pipe(
                    switchMap(({ dashboards, widgets }) => {
                        return this.dashboard.deleteBulk(this.mapWidgetsToDashboards(dashboards, widgets)).pipe(
                            tap(() => console.warn('All dashboards and widgets has been removed'))
                        );
                    }),

                );
            }),
            exhaustMap(() => this.bulkCreateNewDashboards(json)),
            tap(() => console.warn('New dashboards and widgets has been created'))
        );
    }

    private updateExistingDashboards(json: DashboardsExport): Observable<void> {
        return this.confirmRemoval.pipe(
            filter(removeConfirmed => removeConfirmed == false),
            switchMap(() => this.bulkUpdateExistingDashboards(json)),
            tap(() => console.warn('Existing dashboards and widgets has been updated'))
        );
    }

    private mapWidgetsToDashboards(dashboards: Dashboard[], widgets: DashboardWidget[]): DashboardWithWidgets[] {
        return _.map(dashboards, d => Object.assign({}, d, {
            widgets: _.filter(widgets, w => w.dashboard == d.id),
        }));
    }

    private removeAnyAssignForDashboards(dashboards: Dashboard[], widgets: DashboardWidget[]): DashboardWithWidgets[] {
        return _.map(dashboards, (dashboardOld) => {
            dashboardOld.widgets = widgets.filter((i) => i.dashboard === dashboardOld.id);

            delete dashboardOld.id;

            dashboardOld.widgets.forEach((i) => {
                delete i.dashboard;
                delete i.id;
            });

            return dashboardOld;
        });
    }

    private bulkCreateNewDashboards(data: DashboardsExport): Observable<any> {
        return this.dashboard.createBulk(this.removeAnyAssignForDashboards(data.dashboards, data.widgets)).pipe(
            catchError((error) => {
                return this.alertService.open({
                    title: 'Error',
                    text: 'You got an error while create new dashboards and widgets'
                }).pipe(switchMap(() => throwError(() => error)));
            })
        );
    }

    private bulkUpdateExistingDashboards(data: DashboardsExport): Observable<any> {
        return this.dashboard.updateBulk(this.mapWidgetsToDashboards(data.dashboards, data.widgets)).pipe(
            catchError((error) => {
                return this.alertService.open({
                    title: 'Error',
                    text: 'You got an error while update existing dashboards and widgets'
                }).pipe(switchMap(() => throwError(() => error)));
            })
        );
    }

    protected loadFile(file: File): Observable<any> {
        const fileReader = new FileReader();

        fileReader.readAsText(file);

        return new Observable((observer) => {
            // If success
            fileReader.onload = ((ev: ProgressEvent): void => {
                const raw: string = fileReader.result as string;
                const data = JSON.parse(raw);

                observer.next(data);
                observer.complete();
            });

            fileReader.onerror = (error) => {
                observer.error(error);
            };
        });
    }

}
