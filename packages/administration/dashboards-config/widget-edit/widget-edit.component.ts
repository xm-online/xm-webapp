import { Component, HostListener, Input, OnChanges, SimpleChanges, Type } from '@angular/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmEventManager } from '@xm-ngx/core';
import { DashboardWidget } from '@xm-ngx/core/dashboard';
import { copyToClipboard, readFromClipboard } from '@xm-ngx/operators';
import { XmToasterService } from '@xm-ngx/toaster';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { DASHBOARDS_TRANSLATES } from '../const';
import { EditType } from '../dashboard-edit/dashboard-edit.component';
import { DashboardEditorService } from '../dashboard-editor.service';
import { DashboardCollection, DashboardConfig, WidgetCollection } from '../injectors';
import { SchemaEditorOptions } from './schema-editor/schema-editor.component';

export const EDIT_WIDGET_EVENT = 'EDIT_WIDGET_EVENT';

@Component({
    selector: 'xm-widget-edit',
    templateUrl: './widget-edit.component.html',
    styleUrls: ['./widget-edit.component.scss'],
})
export class WidgetEditComponent implements OnChanges {
    public TRS: typeof DASHBOARDS_TRANSLATES = DASHBOARDS_TRANSLATES;
    public EditType: typeof EditType = EditType;
    public formGroup: DashboardWidget = {
        name: '',
        selector: '',
        config: '',
    };
    public loading$: Observable<boolean>;
    public disabled: boolean;
    public dashboardEditComponentType: Type<unknown> = this.dashboardConfig.dashboardRef;
    public EDIT_EVENT: string = this.dashboardConfig.EDIT_WIDGET_EVENT;

    public aceEditorOptions: { title: string; height: string } = { title: '', height: 'calc(100vh - 130px)' };

    public editType: EditType;

    public jsonEditorOptions: SchemaEditorOptions = { selector: null };

    public selectedIndex: number = 1;

    constructor(
        protected readonly widgetService: WidgetCollection,
        protected dashboardService: DashboardCollection,
        protected readonly editorService: DashboardEditorService,
        protected readonly eventManager: XmEventManager,
        protected readonly dashboardConfig: DashboardConfig,
        protected readonly alertService: XmAlertService,
        protected readonly toasterService: XmToasterService) {
        this.loading$ = this.widgetService.loading$.pipe(tap((i) => this.disabled = i));
    }

    private _value: DashboardWidget = {config: null, selector: null};

    public get value(): DashboardWidget {
        return this._value;
    }

    @Input()
    public set value(value: DashboardWidget) {
        this.formGroup = this._value = value as any;

        if (value && value.id) {
            this.editType = EditType.Edit;
        } else {
            this.editType = EditType.Create;
        }
        this.ngOnChanges({});
    }

    @HostListener('document:keydown.escape', ['$event'])
    public onKeydownHandler(event: KeyboardEvent): void {
        if (event) {
            this.onCancel();
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.jsonEditorOptions.selector = this.value.selector;
        // WORKAROUND: Trigger change detection
        this.jsonEditorOptions = {...this.jsonEditorOptions};
    }

    public onCancel(): void {
        this.editorService.close();
        this.editorService.changeEditState(false);
    }

    public onAdd(): void {
        const req: any = this.formGroup;

        this.widgetService.create(req).pipe(
            tap((res) => {
                this.toasterService.create({
                    type: 'success',
                    text: DASHBOARDS_TRANSLATES.created,
                    textOptions: { value: res.name },
                }).subscribe();
                this.value = res;
                this.editType = EditType.Edit;
                this.eventManager.broadcast({ name: this.EDIT_EVENT, id: this.value.dashboard.id, add: true });
            }),
        ).subscribe();
    }

    public onSave(): void {
        this.widgetService.update(this.formGroup).pipe(
            tap((res) => {
                this.toasterService.create({
                    type: 'success',
                    text: DASHBOARDS_TRANSLATES.updated,
                    textOptions: { value: res.name },
                }).subscribe();
                this.eventManager.broadcast({ name: this.EDIT_EVENT, id: this.value.dashboard.id, add: true });
            }),
        ).subscribe();
    }

    public onDelete(): void {
        this.alertService.delete({ textOptions: { value: this.value.name } }).pipe(
            filter((i) => i.value),
            switchMap(() => this.widgetService.delete(this.value.id)),
            tap(() => {
                this.toasterService.create({
                    type: 'success',
                    text: DASHBOARDS_TRANSLATES.deleted,
                    textOptions: { value: this.value.name },
                }).subscribe();
                this.editorService.close();
                this.eventManager.broadcast({ name: this.EDIT_EVENT, id: this.value.dashboard.id, delete: true });
            }),
        ).subscribe();
    }

    @HostListener('keydown.control.s', ['$event'])
    public onCtrlS($event: KeyboardEvent): boolean {
        this.onSave();
        $event.preventDefault();
        return false;
    }

    public backToOrganisation(): void {
        const id = this.value.dashboard.id;
        this.dashboardService.getById(id).subscribe((i) => {
            this.editorService.editDashboard(this.dashboardEditComponentType, i);
        });
    }

    public async onCopyToClipboard(): Promise<void> {
        const text = JSON.stringify(this.formGroup);
        await copyToClipboard(text);
    }

    public async onPasteFromClipboard(): Promise<void> {
        const text = await readFromClipboard();

        let config: DashboardWidget;

        if (_.isString(text)) {
            try {
                config = JSON.parse(text);
            } catch (e) {
                console.warn(e);
                return;
            }
        } else if (_.isObject(text)) {
            config = text as DashboardWidget;
        }

        delete config.id;
        delete config.dashboard.id;
        this.value = _.merge(this.value, config);
    }
}
