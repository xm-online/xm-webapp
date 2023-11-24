import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Dashboard, DashboardWidget } from '@xm-ngx/core/dashboard';
import { download } from '@xm-ngx/operators';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import { delay, finalize, map, take, tap } from 'rxjs/operators';
import { DashboardCollection, WidgetCollection } from '../../injectors';

export interface DashboardsExport {
    dashboards: Dashboard[];
    widgets: DashboardWidget[];
}

function replaceIdWithName([dashboards, widgets]: [Dashboard[], DashboardWidget[]]): void {
    _.forEach(dashboards, (dashboard) => {
        if (!dashboard.layout) {
            return;
        }

        const str = _.replace(JSON.stringify(dashboard.layout), /"widget":([0-9]+)/g, (_match, id) => {
            const widget = widgets.find((i) => i.id === Number(id));

            if (!widget) {
                console.warn(`Wrong widget ID: ${id} at ${dashboard.name}`);
                return _match;
            }

            return `"widgetName":"${widget.name}"`;
        });

        dashboard.layout = JSON.parse(str);
    });
}

@Injectable()
export class DashboardsExportService {

    public loading$: Observable<boolean>;
    protected loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        protected readonly dashboardService: DashboardCollection,
        protected readonly widgetService: WidgetCollection,
        protected readonly datePipe: DatePipe,
    ) {
        this.loading$ = this.loader.asObservable().pipe(delay(0));
    }

    public export(): Observable<string> {
        this.loader.next(true);
        return zip(this.dashboardService.getAll(), this.widgetService.getAll()).pipe(
            take(1),
            tap(replaceIdWithName),
            map(([dashboards, widgets]) => ({dashboards, widgets})),
            map((data: DashboardsExport) => JSON.stringify(data)),
        ).pipe(finalize(() => this.loader.next(false)));
    }

    public exportToFile(fileName: string): void {
        this.export().subscribe((data) => download(
            data,
            `${fileName + this.datePipe.transform(Date.now(), '_dd-MM-yyyy_HH-mm')}.json`,
            '.json'));
    }
}
