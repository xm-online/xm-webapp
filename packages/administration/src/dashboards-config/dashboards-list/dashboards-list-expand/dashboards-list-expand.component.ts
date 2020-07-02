import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Id } from '@xm-ngx/components/entity-collection';
import { Widget } from '@xm-ngx/dashboard';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ACTIONS_COLUMN, DASHBOARDS_TRANSLATES } from '../../const';
import { DashboardEditorService } from '../../dashboard-editor.service';
import { DashboardsManagerService } from '../../dashboards-manager.service';

import { DashboardCollection, WidgetCollection } from '../../injectors';
import { WidgetEditComponent } from '../../widget-edit/widget-edit.component';

const DISPLAYED_COLUMNS = [
    'name',
    'selector',
    'config',
    ACTIONS_COLUMN,
];

@Component({
    selector: 'xm-dashboards-list-expand',
    templateUrl: './dashboards-list-expand.component.html',
    styleUrls: ['./dashboards-list-expand.component.scss'],
})
export class DashboardsListExpandComponent implements OnInit {
    public TRS: typeof DASHBOARDS_TRANSLATES = DASHBOARDS_TRANSLATES;
    public readonly ACTIONS_COLUMN: typeof ACTIONS_COLUMN = ACTIONS_COLUMN;
    public columns: typeof DISPLAYED_COLUMNS = DISPLAYED_COLUMNS;
    public loading$: Observable<boolean>;

    @Input() public dashboardId: Id;

    public widgetsList: MatTableDataSource<Widget>;

    constructor(protected dashboardService: DashboardCollection,
                protected widgetService: WidgetCollection,
                public editorService: DashboardEditorService,
                public managerService: DashboardsManagerService,
    ) {
    }

    public ngOnInit(): void {
        this.loading$ = this.dashboardService.loading$;

        this.dashboardService.getById(this.dashboardId).pipe(
            map((i) => new MatTableDataSource(i.widgets)),
        ).subscribe((i) => {
            this.widgetsList = i;
            this.loadToEditor();
        });
    }

    public onAdd(): void {
        this.editorService.addWidget(WidgetEditComponent, {dashboard: {id: this.dashboardId}});
        this.managerService.setActiveWidget(null);
    }

    public onEdit(item: Widget): void {
        this.editorService.editWidget(WidgetEditComponent, _.assign(item, {dashboard: {id: this.dashboardId}}));
        this.managerService.setActiveWidget(item);
    }

    private loadToEditor(): void {
        if (this.managerService.activeWidget) {
            const edit = this.widgetsList.data.find(d => d.id === this.managerService.activeWidget.id);
            if (edit) {
                this.onEdit(edit);
            }
        }
    }

}
