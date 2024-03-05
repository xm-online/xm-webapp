import { Component, Input, OnDestroy, OnInit, Type } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import { DashboardWidget } from '@xm-ngx/core/dashboard';
import { Id } from '@xm-ngx/interfaces';
import * as _ from 'lodash';
import { set } from 'lodash';
import { Observable } from 'rxjs';
import { delay, map, tap, withLatestFrom } from 'rxjs/operators';
import { ACTIONS_COLUMN, DASHBOARDS_TRANSLATES } from '../../const';
import { CONFIG_TYPE, DashboardEditorService, XM_WEBAPP_OPERATIONS } from '../../services/dashboard-editor.service';
import { DashboardsManagerService } from '../../services/dashboards-manager.service';

import { DashboardCollection, WidgetCollection } from '../../injectors';
import { WidgetEditComponent } from '../widget-edit/widget-edit.component';
import { readFromClipboard, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { XmToasterService } from '@xm-ngx/toaster';
import { MatDialog } from '@angular/material/dialog';
import { OPERATIONS } from '../dashboards-list-copy-dialog/dashboards-list-copy-dialog.component';
import { WidgetCopyDialogComponent } from '../widget-copy-dialog/widget-copy-dialog.component';
import { LoaderModule } from '@xm-ngx/components/loader';
import { MatSortModule } from '@angular/material/sort';
import { XmBoolComponent } from '@xm-ngx/components/bool';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
    standalone: true,
    imports: [
        MatTableModule,
        LoaderModule,
        MatSortModule,
        XmBoolComponent,
        AsyncPipe,
        MatTooltipModule,
        XmTranslationModule,
        MatIconModule,
        NgClass,
        MatButtonModule,
        NgIf
    ],
    templateUrl: './dashboards-list-expand.component.html',
    styleUrls: ['./dashboards-list-expand.component.scss'],
})
export class DashboardsListExpandComponent implements OnInit, OnDestroy {
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
                private matDialog: MatDialog,
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

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
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
            this.widgetService.getAll().subscribe(
                (list) => {
                    const duplicatedWidget = list.find((w) => w.name === copiedObject?.config?.name);
                    if (duplicatedWidget) {
                        this.getAnswerFromDialog().pipe(
                            takeUntilOnDestroy(this),
                            withLatestFrom(this.widgetService.getById(duplicatedWidget.id))).subscribe(([res, widget]) => {
                            if (res === OPERATIONS.COPY) {
                                const widgetsNames = list.map(widget => widget.name);

                                const fn = (value: string, arr: string[], copyLabel: string): string => {
                                    if (!arr.includes(value)) return value;
                                    const copyValue: string = value + copyLabel;
                                    if (!arr.includes(copyValue)) return copyValue;
                                    const copies = arr.filter(copy => copy.startsWith(copyValue));
                                    return `${copyValue}${copies.length + 1}`;
                                };
                                copiedObject.config.name = fn(copiedObject.config.name, widgetsNames, ' Copy');
                                this.widgetService.create(copiedObject.config).pipe(tap((res) => {
                                    this.toasterService.create({
                                        type: 'success',
                                        text: DASHBOARDS_TRANSLATES.created,
                                        textOptions: {value: res.name},
                                    }).subscribe();
                                })).subscribe();
                            }
                            if (res === OPERATIONS.REPLACE) {
                                copiedObject.config.id = widget.id;
                                this.widgetService.update(copiedObject.config).pipe(
                                    tap((res) => {
                                        this.toasterService.create({
                                            type: 'success',
                                            text: DASHBOARDS_TRANSLATES.updated,
                                            textOptions: {value: res.name},
                                        }).subscribe();
                                    }),
                                ).subscribe();

                            }
                        },
                        );
                    } else {
                        this.widgetService.create(copiedObject.config).pipe(
                            tap((res) => {
                                this.toasterService.create({
                                    type: 'success',
                                    text: DASHBOARDS_TRANSLATES.created,
                                    textOptions: {value: res.name},
                                }).subscribe();
                            }),
                        ).subscribe();
                    }

                });

        } else {
            console.warn('Wrong object to paste');
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

    private getAnswerFromDialog(): Observable<string | null> {
        const dialogForm = this.matDialog.open<WidgetCopyDialogComponent>(
            WidgetCopyDialogComponent,
            {width: '400px'},
        );
        return dialogForm.afterClosed();
    }

}
