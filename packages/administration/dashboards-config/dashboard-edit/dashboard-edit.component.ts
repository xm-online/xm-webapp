import { Component, HostListener, inject, Input, Type, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmAceEditorControlOptions } from '@xm-ngx/components/ace-editor';
import { XmTextControlOptions } from '@xm-ngx/components/text';
import { XmEventManager } from '@xm-ngx/core';
import { Dashboard, DashboardConfig, DashboardLayout, DashboardStore, DashboardWidget } from '@xm-ngx/core/dashboard';
import { Principal } from '@xm-ngx/core/user';
import { copyToClipboard, readFromClipboard, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { XmToasterService } from '@xm-ngx/toaster';
import { XmTranslateService } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { prop } from 'lodash/fp';
import { merge, Observable } from 'rxjs';
import { delay, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { DASHBOARDS_TRANSLATES } from '../const';
import { DashboardEditorService } from '../dashboard-editor.service';
import {
    DashboardsListExpandComponent,
} from '../dashboards-list/dashboards-list-expand/dashboards-list-expand.component';
import { DashboardCollection, DashboardConfig as DashboardConfigInjector } from '../injectors';

export enum EditType {
    Create = 1,
    Edit,
}

const uniqValueInListValidator = (stream: Observable<any[]>) => (control: AbstractControl): Observable<ValidationErrors> => {
    return stream.pipe(
        take(1),
        map((arr) => !arr.includes(control.value) ? null : {notUniqInList: true}),
    );
};

@Component({
    selector: 'xm-dashboard-edit',
    templateUrl: './dashboard-edit.component.html',
    styleUrls: ['./dashboard-edit.component.scss'],
})
export class DashboardEditComponent {
    public TRS: typeof DASHBOARDS_TRANSLATES = DASHBOARDS_TRANSLATES;
    public EditType: typeof EditType = EditType;

    private dashboardService: DashboardStore = inject(DashboardStore);
    private dashboardList$: Observable<Dashboard[]> = this.dashboardService.dashboards$().pipe(
        takeUntilOnDestroy(this),
        map(dashboards => dashboards.filter(dashboard => !this.value?.id || dashboard.id !== this.value.id))
    );

    // TODO: Find out the way to use FormGroup instead. P.S. faced with type mismatch.
    public nameControl = new FormControl<string>('', [Validators.required], [uniqValueInListValidator(this.dashboardList$.pipe(map(dashboards => dashboards.map(prop('name')))))]);
    public typeKeyControl = new FormControl<string>('', [Validators.required], [uniqValueInListValidator(this.dashboardList$.pipe(map(dashboards => dashboards.map(prop('typeKey')))))]);
    public configControl = new FormControl<DashboardConfig>({});
    public layoutControl = new FormControl<DashboardLayout>({});
    public valid: boolean = false;

    public loading$: Observable<boolean>;
    public disabled: boolean;
    public EDIT_EVENT: string = this.dashboardConfig.EDIT_DASHBOARD_EVENT;

    public aceEditorOptions: XmAceEditorControlOptions = {title: '', mode: 'json', height: 'calc(100vh - 350px)'};

    public editType: EditType;
    public widgetEditComponentType: Type<unknown> = this.dashboardConfig.widgetRef;
    public nameOptions: XmTextControlOptions = {
        title: this.TRS.name, dataQa: '', errors: {
            notUniqInList: {
                en: 'Not uniq in list',
                uk: 'Not uniq in list',
            },
        },
    };
    public typeKeyOptions: XmTextControlOptions = {
        title: this.TRS.typeKey, dataQa: '', errors: {
            notUniqInList: {
                en: 'Not uniq in list',
                uk: 'Not uniq in list',
            },
        },
    };

    // Used only for copy functional
    @ViewChild(DashboardsListExpandComponent) public widgetsCompRef: DashboardsListExpandComponent;

    @HostListener('document:keydown.escape', ['$event'])
    public onKeydownHandler(event: KeyboardEvent): void {
        if (event) {
            this.onCancel();
        }
    }

    constructor(protected readonly dashboardCollection: DashboardCollection,
                protected readonly editorService: DashboardEditorService,
                protected readonly alertService: XmAlertService,
                protected readonly dashboardConfig: DashboardConfigInjector,
                protected readonly eventManager: XmEventManager,
                protected readonly principal: Principal,
                protected readonly xmTranslateService: XmTranslateService,
                protected readonly translateService: TranslateService,
                protected readonly toasterService: XmToasterService) {
        this.loading$ = this.dashboardCollection.loading$.pipe(delay(0), tap((i) => this.disabled = i));
    }

    public ngOnInit(): void {
        merge(
            this.nameControl.valueChanges,
            this.typeKeyControl.valueChanges,
            this.configControl.valueChanges,
            this.layoutControl.valueChanges,
        )
            .pipe(
                takeUntilOnDestroy(this),
            )
            .subscribe(() => {
                this.valid = this.nameControl.valid && this.typeKeyControl.valid && this.configControl.valid && this.layoutControl.valid;
            });
    }

    protected _value: Dashboard = {};

    public get value(): Dashboard {
        return this._value;
    }

    @Input()
    public set value(value: Dashboard) {
        this._value = value;

        this.nameControl.patchValue(value.name);
        this.typeKeyControl.patchValue(value.typeKey);
        this.configControl.patchValue(value.config);
        this.layoutControl.patchValue(value.layout);

        if (value && value.id) {
            this.editType = EditType.Edit;
        } else {
            this.editType = EditType.Create;
        }
    }

    public onCancel(): void {
        this.editorService.close();
        this.editorService.changeEditState(false);
    }

    public onAdd(): void {
        const req: Dashboard = this.dashboardValue();
        // TODO: improve BE
        req.isPublic = false;
        req.owner = this.principal.getUserKey();

        this.dashboardCollection.create(req).pipe(
            tap((res) => {
                this.toasterService.create({
                    type: 'success',
                    text: DASHBOARDS_TRANSLATES.created,
                    textOptions: {value: res.name},
                }).subscribe();
                this.value = res;
                this.editType = EditType.Edit;
                this.eventManager.broadcast({name: this.EDIT_EVENT, id: this.value.id, add: true});
            }),
        ).subscribe();
    }

    public onSave(): void {
        _.assign(this._value, this.dashboardValue());
        delete this._value.widgets;
        this.dashboardCollection.update(this._value).pipe(
            tap((res) => {
                this.eventManager.broadcast({name: this.EDIT_EVENT, id: this.value.id, edit: true});
                this.toasterService.create({
                    type: 'success',
                    text: DASHBOARDS_TRANSLATES.updated,
                    textOptions: {value: res.name},
                }).subscribe();
            }),
        ).subscribe();
    }

    public onDuplicate(): void {
        const req: Dashboard = this.dashboardValue();

        this.dashboardCollection.getById(req.id).subscribe((d) => {
            req.id = null;
            req.name = `${req.name} ${this.translateService.instant(DASHBOARDS_TRANSLATES.copy)}`;
            req.widgets = this.getUnbindedWidgets(d.widgets);

            this.onAdd();
        });
    }

    public onDelete(): void {
        this.alertService.delete({
            title: this.xmTranslateService.translate(DASHBOARDS_TRANSLATES.deleted, {value: this.value.name}),
        }).pipe(
            filter((i) => i.value),
            switchMap(() => this.dashboardCollection.delete(this.value.id)),
            tap((res) => {
                this.toasterService.create({
                    type: 'success',
                    text: DASHBOARDS_TRANSLATES.deleted,
                    textOptions: {value: this.value.name},
                }).subscribe();
                this.eventManager.broadcast({name: this.EDIT_EVENT, id: this.value.id, delete: true});
            }),
            tap(() => this.editorService.close()),
        ).subscribe();
    }


    @HostListener('keydown.control.s', ['$event'])
    public onCtrlS($event: KeyboardEvent): boolean {
        this.onSave();
        $event.preventDefault();
        return false;
    }

    public async onCopyToClipboard(): Promise<void> {
        const data = _.cloneDeep(this.dashboardValue());

        _.set(data, 'widgets', this.widgetsCompRef?.widgetsList?.data.slice());

        const text = JSON.stringify(data);

        await copyToClipboard(text);
    }

    public async onPasteFromClipboard(): Promise<void> {
        const text = await readFromClipboard();

        let config: Dashboard;

        if (_.isString(text)) {
            try {
                config = JSON.parse(text);
            } catch (e) {
                console.warn(e);
                return;
            }
        } else if (_.isObject(text)) {
            config = text as Dashboard;
        }

        delete config.id;
        config.widgets = this.getUnbindedWidgets(config.widgets);

        this.value = _.merge(this.value, config);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private getUnbindedWidgets(widgets: DashboardWidget[]): DashboardWidget[] {
        return widgets.map((w) => {
            delete w.id;
            delete w.dashboard;
            return w;
        });
    }

    private dashboardValue(): Dashboard {
        return {
            name: this.nameControl.value,
            typeKey: this.typeKeyControl.value,
            config: this.configControl.value,
            layout: this.layoutControl.value,
        };
    }
}
