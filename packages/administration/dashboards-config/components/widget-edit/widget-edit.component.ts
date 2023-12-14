import { Component, HostListener, Input, OnChanges, SimpleChanges, Type } from '@angular/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmEventManager } from '@xm-ngx/core';
import { DashboardWidget } from '@xm-ngx/core/dashboard';
import { copyToClipboard, readFromClipboard } from '@xm-ngx/operators';
import { XmToasterService } from '@xm-ngx/toaster';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { DASHBOARDS_TRANSLATES } from '../../const';
import { EditType } from '../dashboard-edit/dashboard-edit.component';
import { CONFIG_TYPE, CopiedObject, DashboardEditorService, XM_WEBAPP_OPERATIONS } from '../../services/dashboard-editor.service';
import { DashboardCollection, DashboardConfig, WidgetCollection } from '../../injectors';
import { SchemaEditorComponent, SchemaEditorOptions } from '../schema-editor/schema-editor.component';
import { XmTranslateService, XmTranslationModule } from '@xm-ngx/translation';
import { LoaderModule } from '@xm-ngx/components/loader';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ConfigEditorComponent } from '../config-editor.component';
import { XmTextControl } from '@xm-ngx/components/text';
import { FormsModule } from '@angular/forms';
import { WidgetConfigExamplesComponent } from '../widget-config-examples.component';
import { SelectorTextControlComponent } from '../selector-text-control/selector-text-control.component';
import { CopiedWidgetObject } from '../dashboards-list-expand/dashboards-list-expand.component';
import { ConfigurationHistoryComponent } from '../../configuration-history/configuration-history.component';
import { DashboardsConfigHistoryService } from '../../services/dashboards-config-history.service';

export const EDIT_WIDGET_EVENT = 'EDIT_WIDGET_EVENT';

@Component({
    imports: [
        LoaderModule,
        MatTooltipModule,
        MatIconModule,
        MatButtonModule,
        NgIf,
        WidgetConfigExamplesComponent,
        MatTabsModule,
        XmTranslationModule,
        SelectorTextControlComponent,
        ConfigEditorComponent,
        XmTextControl,
        FormsModule,
        AsyncPipe,
        SchemaEditorComponent,
        ConfigurationHistoryComponent,
    ],
    selector: 'xm-widget-edit',
    standalone: true,
    styleUrls: ['./widget-edit.component.scss'],
    templateUrl: './widget-edit.component.html',
    providers: [ DashboardsConfigHistoryService ],
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

    public editType: EditType;

    public jsonEditorOptions: SchemaEditorOptions = { selector: null };

    public selectedIndex: number = 1;

    public historyEvents;

    constructor(
        protected readonly widgetService: WidgetCollection,
        protected dashboardService: DashboardCollection,
        protected readonly editorService: DashboardEditorService,
        protected readonly eventManager: XmEventManager,
        protected readonly dashboardConfig: DashboardConfig,
        protected readonly alertService: XmAlertService,
        protected readonly xmTranslateService: XmTranslateService,
        protected readonly toasterService: XmToasterService,
        protected readonly dashboardsConfigHistoryService: DashboardsConfigHistoryService,
    ) {
        this.loading$ = this.widgetService.loading$.pipe(tap((i) => this.disabled = i));
    }

    private _value: DashboardWidget = {config: null, selector: null};

    public get valid(): boolean {
        return !!this.formGroup && !!this.formGroup.name && !!this.formGroup.selector;
    }

    public get value(): DashboardWidget {
        return this._value;
    }

    @Input()
    public set value(value: DashboardWidget) {
        this.formGroup = this._value = value as any;

        if (value && value.id) {
            this.editType = EditType.Edit;
            this.historyEvents = this.dashboardsConfigHistoryService.widgetConfigHistory(value.id);
        } else {
            this.editType = EditType.Create;
            this.selectedIndex = 0;
        }
        this.ngOnChanges({});
    }

    @HostListener('document:keydown.escape', ['$event'])
    public onKeydownHandler(event: KeyboardEvent): void {
        if (event) {
            this.backToOrganisation();
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.jsonEditorOptions.selector = this.value.selector;
        // WORKAROUND: Trigger change detection
        this.jsonEditorOptions = {...this.jsonEditorOptions};
    }

    public onCancel(): void {
        this.editorService.close();
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
                this.eventManager.broadcast({ name: this.EDIT_EVENT, id: this.dashboardId, add: true });
            }),
        ).subscribe();
    }

    public onSave(): void {
        if (!this.valid) {
            console.warn("Widget isn't valid");
            return;
        }

        this.widgetService.update(this.formGroup).pipe(
            tap((res) => {
                this.toasterService.create({
                    type: 'success',
                    text: DASHBOARDS_TRANSLATES.updated,
                    textOptions: { value: res.name },
                }).subscribe();
                this.eventManager.broadcast({ name: this.EDIT_EVENT, id: this.dashboardId, add: true });
            }),
        ).subscribe();
    }

    public onDelete(): void {
        this.alertService.delete({
            title: this.xmTranslateService.translate(DASHBOARDS_TRANSLATES.delete, { value: this.value.name })
        }).pipe(
            filter((i) => i.value),
            switchMap(() => this.widgetService.delete(this.value.id)),
            tap(() => {
                this.toasterService.create({
                    type: 'success',
                    text: DASHBOARDS_TRANSLATES.deleted,
                    textOptions: { value: this.value.name },
                }).subscribe();
                this.editorService.close();
                this.eventManager.broadcast({ name: this.EDIT_EVENT, id: this.dashboardId, delete: true });
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
        const id = this.dashboardId;
        this.dashboardService.getById(id).subscribe((i) => {
            this.editorService.editDashboard(this.dashboardEditComponentType, i);
        });
    }

    public async onCopyToClipboard(): Promise<void> {
        const data = _.cloneDeep(this.formGroup);
        delete data.id;
        delete data.dashboard;

        const enrichedData: CopiedObject = {type: XM_WEBAPP_OPERATIONS.COPY, configType: CONFIG_TYPE.WIDGET, config: data};
        const text = JSON.stringify(enrichedData);

        await copyToClipboard(text);
    }

    public async onPasteFromClipboard(): Promise<void> {
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

        this.value = _.merge(this.value, copiedObject.config);
    }

    private get dashboardId(): number {
        return this.value?.dashboard?.id || this.value?.dashboard;
    }
}
