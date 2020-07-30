import { Component, HostListener, Input } from '@angular/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmEventManager } from '@xm-ngx/core';
import { Principal } from '@xm-ngx/core/auth';
import { Dashboard } from '@xm-ngx/dashboard';
import { XmToasterService } from '@xm-ngx/toaster';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { DASHBOARDS_TRANSLATES, EDIT_DASHBOARD_EVENT } from '../const';
import { DashboardEditorService } from '../dashboard-editor.service';
import { DashboardCollection } from '../injectors';
import { TranslateService } from '@ngx-translate/core';

export enum EditType {
    Create = 1,
    Edit,
}

@Component({
    selector: 'xm-dashboard-edit',
    templateUrl: './dashboard-edit.component.html',
    styleUrls: ['./dashboard-edit.component.scss'],
})
export class DashboardEditComponent {
    public TRS: typeof DASHBOARDS_TRANSLATES = DASHBOARDS_TRANSLATES;
    public EditType: typeof EditType = EditType;
    public formGroup: Dashboard = {
        name: '',
        typeKey: '',
        config: {},
        layout: {},
    };
    public loading$: Observable<boolean>;
    public disabled: boolean;

    public aceEditorOptions: { title: string; height: string } = {title: '', height: 'calc(100vh - 350px)'};

    public editType: EditType;

    constructor(protected dashboardService: DashboardCollection,
                protected editorService: DashboardEditorService,
                protected alertService: XmAlertService,
                protected readonly eventManager: XmEventManager,
                protected principal: Principal,
                protected translateService: TranslateService,
                protected toasterService: XmToasterService) {
        this.loading$ = this.dashboardService.loading$.pipe(tap((i) => this.disabled = i));
    }

    private _value: Dashboard;

    public get value(): Dashboard {
        return this._value;
    }

    @Input()
    public set value(value: Dashboard) {
        this.formGroup = this._value = value as any;

        if (value && value.id) {
            this.editType = EditType.Edit;
        } else {
            this.editType = EditType.Create;
        }
    }

    public onCancel(): void {
        this.editorService.close();
    }

    public onAdd(): void {
        const req: any = this.formGroup;
        // TODO: improve BE
        req.isPublic = false;
        req.owner = this.principal.getUserKey();

        this.dashboardService.create(req).pipe(
            tap((res) => {
                this.toasterService.create({
                    type: 'success',
                    text: DASHBOARDS_TRANSLATES.created,
                    textOptions: {value: res.name},
                }).subscribe();
                this.value = res;
                this.editType = EditType.Edit;
                this.eventManager.broadcast({name: EDIT_DASHBOARD_EVENT, id: this.value.id, add: true});
            }),
        ).subscribe();
    }

    public onSave(): void {
        _.assign(this._value, this.formGroup);
        delete this._value.widgets;
        this.dashboardService.update(this._value).pipe(
            tap((res) => {
                this.eventManager.broadcast({name: EDIT_DASHBOARD_EVENT, id: this.value.id, edit: true});
                this.toasterService.create({
                    type: 'success',
                    text: DASHBOARDS_TRANSLATES.updated,
                    textOptions: {value: res.name},
                }).subscribe();
            }),
        ).subscribe();
    }

    public onDuplicate(): void {
        const req: any = this.formGroup;

        this.dashboardService.getById(req.id as number).subscribe((d) => {
            req.id = null;
            req.name = `${req.name} ${this.translateService.instant(DASHBOARDS_TRANSLATES.copy)}`;
            req.widgets = d.widgets.map((w) => {
                delete w.id;
                delete w.dashboard;
                return w;
            });

            this.onAdd();
        });
    }

    public onDelete(): void {
        this.alertService.delete({textOptions: {value: this.value.name}}).pipe(
            filter((i) => i.value),
            switchMap(() => this.dashboardService.delete(this.value.id)),
            tap((res) => {
                this.toasterService.create({
                    type: 'success',
                    text: DASHBOARDS_TRANSLATES.deleted,
                    textOptions: {value: this.value.name},
                }).subscribe();
                this.eventManager.broadcast({name: EDIT_DASHBOARD_EVENT, id: this.value.id, delete: true});
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
}
