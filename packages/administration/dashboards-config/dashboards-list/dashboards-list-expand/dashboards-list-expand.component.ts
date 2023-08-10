import { Component, Input, OnInit, Type } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { DashboardWidget } from '@xm-ngx/core/dashboard';
import { Id } from '@xm-ngx/interfaces';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { ACTIONS_COLUMN, DASHBOARDS_TRANSLATES } from '../../const';
import { CONFIG_TYPE, DashboardEditorService, XM_WEBAPP_OPERATIONS } from '../../dashboard-editor.service';
import { DashboardsManagerService } from '../../dashboards-manager.service';

import { DashboardCollection, WidgetCollection } from '../../injectors';
import { WidgetEditComponent } from '../../widget-edit/widget-edit.component';
import { readFromClipboard } from '@xm-ngx/operators';
import { XmToasterService } from '@xm-ngx/toaster';
import { set } from 'lodash';

const DISPLAYED_COLUMNS = [
    'name',
    'selector',
    'config',
    ACTIONS_COLUMN,
];

export interface CopiedWidgetObject {
    type: XM_WEBAPP_OPERATIONS,
    configType: CONFIG_TYPE,
    config: DashboardWidget,
}

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
    @Input() public widgetEditComponentType: Type<unknown> = WidgetEditComponent;

    public widgetsList: MatTableDataSource<DashboardWidget>;

    constructor(protected dashboardService: DashboardCollection,
                protected widgetService: WidgetCollection,
                public editorService: DashboardEditorService,
                public managerService: DashboardsManagerService,
                protected readonly toasterService: XmToasterService,
    ) {
    }

    public ngOnInit(): void {
        this.loading$ = this.dashboardService.loading$.pipe(delay(0));

        this.dashboardService.getById(this.dashboardId).pipe(
            map((i) => _.orderBy(i?.widgets, 'name')),
            map((widgets) => new MatTableDataSource(widgets)),
        ).subscribe((i) => {
            this.widgetsList = i;
            this.loadToEditor();
        });
    }

    public onAdd(): void {
        this.editorService.addWidget(this.widgetEditComponentType, {dashboard: {id: this.dashboardId}});
        this.managerService.setActiveWidget(null);
    }

    public async onPaste(): Promise<void> {
        const text = await readFromClipboard();
        let copiedObject: CopiedWidgetObject;
        if (_.isString(text)) {
            try {
                copiedObject = JSON.parse(text) as CopiedWidgetObject;
            } catch (e) {
                console.warn(e);
                return;
            }
        } else if (_.isObject(text)) {
            copiedObject = text as CopiedWidgetObject;
        }

        set(copiedObject, 'config.dashboard.id', this.dashboardId);

        if (copiedObject.configType === CONFIG_TYPE.WIDGET) {
            this.widgetService.create(copiedObject.config).pipe(
                tap((res) => {
                    this.toasterService.create({
                        type: 'success',
                        text: DASHBOARDS_TRANSLATES.created,
                        textOptions: { value: res.name },
                    }).subscribe();
                }),
            ).subscribe();
        }

    }

    public onEdit(item: DashboardWidget): void {
        this.editorService.editWidget(this.widgetEditComponentType, _.assign(item, {dashboard: {id: this.dashboardId}}));
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
