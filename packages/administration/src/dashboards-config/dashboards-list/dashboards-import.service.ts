import { Injectable } from '@angular/core';
import { DASHBOARDS_TRANSLATES } from '../const';
import { XmAlertService } from '@xm-ngx/alert';
import { DashboardService } from '@xm-ngx/dynamic';
import * as _ from 'lodash';
import { BehaviorSubject, concat, Observable, of } from 'rxjs';
import { concatAll, finalize, switchMap } from 'rxjs/operators';
import { DashboardCollection, WidgetCollection } from '../injectors';
import { DashboardsExport } from './dashboards-export.service';

@Injectable()
export class DashboardsImportService {

    public loading$: Observable<boolean>;
    protected loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        protected readonly dashboardService: DashboardCollection,
        public dashboard: DashboardService,
        protected readonly widgetService: WidgetCollection,
        protected readonly alertService: XmAlertService,
    ) {
        this.loading$ = this.loader.asObservable();
    }

    public import(file: File): Observable<string> {
        this.loader.next(true);

        const delete$ = this.alertService.yesNo({text: DASHBOARDS_TRANSLATES.deleted}).pipe(
            switchMap((i) => {

                if (i.dismiss) {
                    return of(true);
                }

                return concat([
                    this.deleteAllWidgets(),
                    this.deleteAllDashboards(),
                ]).pipe(concatAll());

            }),
        );

        return this.loadFile(file).pipe(
            switchMap((data) => concat([delete$, this.importDashboards(data)])),
            concatAll(),
            finalize(() => this.loader.next(false)),
        );

    }

    public deleteAllWidgets(): Observable<any> {
        return this.widgetService.getAll().pipe(
            switchMap((arr) => concat(_.map(arr, (i) => this.widgetService.delete(i.id)))),
            concatAll(),
        );
    }

    public deleteAllDashboards(): Observable<any> {
        return this.dashboardService.getAll().pipe(
            switchMap((arr) => concat(_.map(arr, (i) => this.dashboardService.delete(i.id)))),
            concatAll(),
        );
    }

    public importDashboards(data: DashboardsExport): Observable<any> {
        return concat(
            _.map(data.dashboards, (dashboardOld) => {
                dashboardOld.widgets = data.widgets.filter((i) => i.dashboard === dashboardOld.id);
                delete dashboardOld.id;

                dashboardOld.widgets.forEach((i) => {
                    delete i.dashboard;
                    delete i.id;
                });
                return this.dashboard.create(dashboardOld as any);
            }),
        ).pipe(concatAll());
    }

    protected loadFile(file: File): Observable<any> {

        const fileReader = new FileReader();

        fileReader.readAsText(file);

        return new Observable((observer) => {
            // if success
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
