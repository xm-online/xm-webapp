import {
    AfterViewInit,
    Component,
    HostListener,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Type,
    ViewChild
} from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { XmAlertService } from '@xm-ngx/alert';
import {
    XmAceEditorControl,
    XmAceEditorControlModeEnum,
    XmAceEditorControlOptions,
    XmAceEditorControlTypeEnum
} from '@xm-ngx/components/ace-editor';
import { XM_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/control-error';
import { XmTextControl, XmTextControlOptions } from '@xm-ngx/components/text';
import { XmEventManager } from '@xm-ngx/core';
import { Dashboard, DashboardConfig, DashboardLayout, DashboardStore, DashboardWidget } from '@xm-ngx/core/dashboard';
import { Principal } from '@xm-ngx/core/user';
import {
    takeUntilOnDestroy, takeUntilOnDestroyDestroy
} from '@xm-ngx/operators';
import { XmToasterService } from '@xm-ngx/toaster';
import { XmTranslateService, XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { prop } from 'lodash/fp';
import { merge, Observable } from 'rxjs';
import { delay, distinctUntilChanged, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { DASHBOARDS_TRANSLATES } from '../../const';
import {
    DashboardEditorService,
} from '../../services/dashboard-editor.service';
import { DashboardsListExpandComponent } from '../dashboards-list-expand/dashboards-list-expand.component';
import { DashboardCollection, DashboardConfig as DashboardConfigInjector } from '../../injectors';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { LoaderModule } from '@xm-ngx/components/loader';
import { RouterLink } from '@angular/router';
import { ConfigurationHistoryComponent } from '../../configuration-history/configuration-history.component';
import { DashboardsConfigHistoryService } from '../../services/dashboards-config-history.service';
import { HistoryEvent } from '../../configuration-history/models/config-history.model';
import {
    CopyDirective,
    ClipboardOperations,
    PasteDirective
} from '@xm-ngx/components/copy-paste-directive';
import { cloneDeep, omit } from 'lodash';

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
    standalone: true,
    imports: [
        XmTranslationModule,
        MatTooltipModule,
        MatIconModule,
        MatButtonModule,
        CommonModule,
        MatTabsModule,
        DashboardsListExpandComponent,
        XmTextControl,
        LoaderModule,
        XmAceEditorControl,
        RouterLink,
        ReactiveFormsModule,
        ConfigurationHistoryComponent,
        FormsModule,
        CopyDirective,
        PasteDirective,
    ],
    templateUrl: './dashboard-edit.component.html',
    styleUrls: ['./dashboard-edit.component.scss'],
})
export class DashboardEditComponent implements OnInit, OnDestroy, AfterViewInit {
    public TRS: typeof DASHBOARDS_TRANSLATES = DASHBOARDS_TRANSLATES;
    public EditType: typeof EditType = EditType;
    public configControl = new FormControl<DashboardConfig>({});
    public layoutControl = new FormControl<DashboardLayout>({});
    public valid: boolean = false;
    public loading$: Observable<boolean>;
    public disabled: boolean;
    public EDIT_EVENT: string = this.dashboardConfig.EDIT_DASHBOARD_EVENT;
    public aceEditorOptions: XmAceEditorControlOptions = {
        title: '',
        mode: XmAceEditorControlModeEnum.JSON,
        type: XmAceEditorControlTypeEnum.OBJECT,
        height: 'calc(100vh - 350px)',
    };
    public editType: EditType;
    public widgetEditComponentType: Type<unknown> = this.dashboardConfig.widgetRef;
    // Used only for copy functional
    @ViewChild(DashboardsListExpandComponent) public widgetsCompRef: DashboardsListExpandComponent;
    private dashboardService: DashboardStore = inject(DashboardStore);
    private xmControlErrorsTranslates = inject(XM_CONTROL_ERRORS_TRANSLATES);
    public nameOptions: XmTextControlOptions = {
        title: this.TRS.name,
        dataQa: '',
        errors: {
            required: this.xmControlErrorsTranslates.required,
            notUniqInList: {
                en: 'Dashboard with this name already exist',
                uk: 'Інформаційна панель із такою назвою вже існує',
            },
        },
    };
    public typeKeyOptions: XmTextControlOptions = {
        title: this.TRS.typeKey,
        dataQa: '',
        errors: {
            required: this.xmControlErrorsTranslates.required,
            notUniqInList: {
                en: 'Dashboard with this TypeKey already exist',
                uk: 'Інформаційна панель із цим TypeKey вже існує',
            },
            pattern: {
                en: 'TypeKey allows letters in uppercase, numbers, dot and dash symbols. The first and last characters must be letters.',
                uk: 'TypeKey дозволяє використовувати літери у верхньому регістрі, цифри, крапку та тире. Перший та останній символи повинні бути літерами.',
            },
        },
    };
    public configHistoryEvents: Observable<HistoryEvent[]>;
    public layoutHistoryEvents: Observable<HistoryEvent[]>;

    private dashboardList$: Observable<Dashboard[]> = this.dashboardService.dashboards$().pipe(
        takeUntilOnDestroy(this),
        map(dashboards => dashboards.filter(dashboard => !this.value?.id || dashboard.id !== this.value.id)),
    );
    // TODO: Find out the way to use FormGroup instead. P.S. faced with type mismatch.
    public nameControl = new FormControl<string>('', [Validators.required], [uniqValueInListValidator(this.dashboardList$.pipe(map(dashboards => dashboards.map(prop('name')))))]);
    public typeKeyControl = new FormControl<string>(
        '',
        [Validators.required, Validators.pattern('^[A-Z0-9\\.-]+$')],
        [uniqValueInListValidator(this.dashboardList$.pipe(map(dashboards => dashboards.map(prop('typeKey')))))],
    );
    public dashboardWidgets: DashboardWidget[];
    public ClipboardOperations = ClipboardOperations;
    private initialConfig: DashboardConfig | null = null;
    private initialLayout: DashboardLayout | null = null;

    constructor(
        protected readonly dashboardCollection: DashboardCollection,
        protected readonly editorService: DashboardEditorService,
        protected readonly alertService: XmAlertService,
        protected readonly dashboardConfig: DashboardConfigInjector,
        protected readonly eventManager: XmEventManager,
        protected readonly principal: Principal,
        protected readonly xmTranslateService: XmTranslateService,
        protected readonly translateService: TranslateService,
        protected readonly toasterService: XmToasterService,
        protected readonly dashboardsConfigHistoryService: DashboardsConfigHistoryService,
    ) {
        this.loading$ = this.dashboardCollection.loading$.pipe(
            delay(0),
            tap(i => (this.disabled = i)),
        );
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
        this.saveInitialValues();

        if (value && value.id) {
            this.editType = EditType.Edit;
            this.configHistoryEvents = this.dashboardsConfigHistoryService.dashboardConfigHistory(value.id);
            this.layoutHistoryEvents = this.dashboardsConfigHistoryService.dashboardLayoutHistory(value.id);
        } else {
            this.editType = EditType.Create;
        }
    }

    @HostListener('document:keydown.escape', ['$event'])
    public onKeydownHandler(event: KeyboardEvent): void {
        if (event) {
            this.onCancel();
        }
    }

    private saveInitialValues(): void {
        this.initialConfig = cloneDeep(this.configControl.value);
        this.initialLayout = cloneDeep(this.layoutControl.value);
    }

    public ngAfterViewInit(): void {
        this.typeKeyControl.valueChanges.pipe(takeUntilOnDestroy(this), distinctUntilChanged()).subscribe(rawValue => {
            const value = rawValue?.toUpperCase().replace(/ /g, '-');
            this.typeKeyControl.patchValue(value, {emitEvent: true});
        });
    }

    public ngOnInit(): void {
        merge(this.nameControl.valueChanges, this.typeKeyControl.valueChanges, this.configControl.valueChanges, this.layoutControl.valueChanges)
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => {
                this.valid = this.nameControl.valid && this.typeKeyControl.valid && this.configControl.valid && this.layoutControl.valid;
            });
    }

    public onCancel(): void {
        this.editorService.close();
    }

    public onAdd(req: Dashboard = this.dashboardValue()): void {
        // TODO: improve BE
        req.isPublic = false;
        req.owner = this.principal.getUserKey();

        this.dashboardCollection
            .create(req)
            .pipe(
                tap(res => {
                    this.toasterService
                        .create({
                            type: 'success',
                            text: DASHBOARDS_TRANSLATES.created,
                            textOptions: {value: res.name},
                        })
                        .subscribe();
                    this.value = res;
                    this.editType = EditType.Edit;
                    this.eventManager.broadcast({name: this.EDIT_EVENT, id: this.value.id, add: true});
                }),
            )
            .subscribe();
    }

    public onSave(): void {
        _.assign(this._value, this.dashboardValue());
        delete this._value.widgets;
        this.dashboardCollection
            .update(this._value)
            .pipe(
                tap(res => {
                    this.eventManager.broadcast({name: this.EDIT_EVENT, id: this.value.id, edit: true});
                    this.toasterService
                        .create({
                            type: 'success',
                            text: DASHBOARDS_TRANSLATES.updated,
                            textOptions: {value: res.name},
                        })
                        .subscribe();
                    this.saveInitialValues();
                }),
            )
            .subscribe();
    }

    public onDuplicate(): void {
        this.dashboardCollection.getById(this.value.id).subscribe(d => {
            const req: Dashboard = this.dashboardValue();
            req.id = null;
            req.name = `${req.name} ${this.translateService.instant(DASHBOARDS_TRANSLATES.copy)}`;
            req.widgets = this.getUnbindedWidgets(d.widgets || []);
            req.typeKey = `${this.value.typeKey}-copy`;

            this.onAdd(req);
        });
    }

    public onDelete(): void {
        this.alertService
            .delete({
                title: this.xmTranslateService.translate(DASHBOARDS_TRANSLATES.delete, {value: this.value.name}),
            })
            .pipe(
                filter(i => i.value),
                switchMap(() => this.dashboardCollection.delete(this.value.id)),
                tap(res => {
                    this.toasterService
                        .create({
                            type: 'success',
                            text: DASHBOARDS_TRANSLATES.deleted,
                            textOptions: {value: this.value.name},
                        })
                        .subscribe();
                    this.eventManager.broadcast({name: this.EDIT_EVENT, id: this.value.id, delete: true});
                }),
                tap(() => this.editorService.close()),
            )
            .subscribe();
    }

    public onPreview(): void {
        if (!this.valid) return;
        if (!this.hasUnsavedChanges()) {
            this.toasterService.create({
                type: 'info',
                text: { en: 'No unsaved data for preview', uk: 'Немає незбережених даних для перегляду' }
            }).subscribe();
        } else {
            console.log('go to preview');
        }
    }

    @HostListener('keydown.control.s', ['$event'])
    public onCtrlS($event: KeyboardEvent): boolean {
        this.onSave();
        $event.preventDefault();
        return false;
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public dashboardValue(): Dashboard {
        return {
            name: this.nameControl.value,
            typeKey: this.typeKeyControl.value,
            config: this.configControl.value,
            layout: this.layoutControl.value,
        };
    }

    public eventValue(value: Dashboard): void {
        this.value = value;
        this.dashboardWidgets = this.getUnbindedWidgets(value.widgets);
    }

    public getData(): Dashboard {
        const data = _.cloneDeep(this.value);
        _.set(data , 'widgets', this.widgetsCompRef?.widgetsList?.data.slice());
        delete data.id;
        data.widgets = data.widgets?.map(widget => omit(cloneDeep(widget), ['id', 'dashboard']) as DashboardWidget);
        return data;
    }

    private getUnbindedWidgets(widgets: DashboardWidget[]): DashboardWidget[] {
        return widgets.map(w => {
            delete w.id;
            delete w.dashboard;
            return w;
        });
    }

    private hasUnsavedChanges(): boolean {
        const configChanged = !_.isEqual(this.initialConfig, this.configControl.value);
        const layoutChanged = !_.isEqual(this.initialLayout, this.layoutControl.value);
        return configChanged || layoutChanged;
    }
}
