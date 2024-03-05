import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    DASHBOARD_CONFIG_PROVIDER,
    DashboardCollection,
    DashboardConfig,
    DashboardEditorService,
    DASHBOARDS_TRANSLATES,
    DashboardsExportService,
    DashboardsImportService,
    DashboardsManagerService,
    WidgetCollection,
} from '@xm-ngx/administration/dashboards-config';
import { XmEventManager } from '@xm-ngx/core';
import { Dashboard, DashboardStore, PageService } from '@xm-ngx/core/dashboard';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { skip, take } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import {
    ChangebleDirectiveService
} from '@xm-ngx/dashboard/src/changeable/changeble-directive.service';

export const NAVBAR_EDIT_DASHBOARD_EVENT = 'NAVBAR_EDIT_DASHBOARD_EVENT';
export const NAVBAR_EDIT_WIDGET_EVENT = 'NAVBAR_EDIT_WIDGET_EVENT';

export const NAVBAR_DASHBOARD_EDIT_STORAGE_KEY = 'NAVBAR_DASHBOARD_EDIT_STORAGE_KEY';

export enum NavbarDashboardEditState {
    Open = 'OPEN',
    Close = 'CLOSE',
}

@Component({
    selector: 'xm-navbar-dashboard-edit-widget',
    template: `
        <button mat-icon-button
                *permitted="['DASHBOARD.CREATE']"
                [style.visibility]="page ? 'visible' : 'hidden'"
                [color]="isEditing ? 'primary' : undefined"
                [matTooltip]="TRS.editDashboard | translate"
                (click)="onEdit()">
            <mat-icon>edit</mat-icon>
        </button>
    `,
    standalone: true,
    imports: [
        XmTranslationModule,
        XmPermissionModule,
        MatButtonModule,
        MatTooltipModule,
        AsyncPipe,
        MatIconModule,
    ],
    providers: [
        DashboardCollection,
        WidgetCollection,
        DashboardEditorService,
        DashboardsExportService,
        DashboardsImportService,
        DASHBOARD_CONFIG_PROVIDER,
        { provide: DashboardsManagerService, useValue: { setActiveWidget: () => null } },
    ],
})
export class NavbarDashboardEditWidgetComponent implements OnInit, OnDestroy, XmDynamicWidget {
    @Input() public config: unknown;

    public TRS: typeof DASHBOARDS_TRANSLATES = DASHBOARDS_TRANSLATES;

    public page: Dashboard;
    public isEditing: boolean;

    constructor(
        protected readonly wrapperService: DashboardStore,
        protected readonly eventManager: XmEventManager,
        private pageService: PageService,
        protected readonly dashboardConfig: DashboardConfig,
        private editorService: DashboardEditorService,
        private changebleDirectiveService: ChangebleDirectiveService,
    ) {
    }

    public ngOnInit(): void {
        this.changeEditState();

        this.pageService.active$().pipe(takeUntilOnDestroy(this)).subscribe((i) => {
            this.page = i as Dashboard;
            if (this.isEditing) {
                this.editorService.editDashboard(this.dashboardConfig.dashboardRef, this.page);
            } else if (sessionStorage.getItem(NAVBAR_DASHBOARD_EDIT_STORAGE_KEY) === NavbarDashboardEditState.Open) {
                this.onEdit();
            }
        });

        this.eventManager.listenTo(this.dashboardConfig.EDIT_DASHBOARD_EVENT)
            .pipe(takeUntilOnDestroy(this))
            .subscribe(({ id }) => this.updateView(id));

        this.eventManager.listenTo(this.dashboardConfig.EDIT_WIDGET_EVENT)
            .pipe(takeUntilOnDestroy(this))
            .subscribe(({ id }) => this.updateView(this.page.id));
    }

    public changeEditState(): void {
        this.editorService.changeEditState().pipe(takeUntilOnDestroy(this)).subscribe((isEdit) => {
            this.isEditing = isEdit;
        });
    }

    public onEdit(): void {
        this.editorService.editDashboard(this.dashboardConfig.dashboardRef, this.page);
        sessionStorage.setItem(NAVBAR_DASHBOARD_EDIT_STORAGE_KEY, NavbarDashboardEditState.Open);
        this.editorService.setValue(!this.isEditing);
        this.isEditing = true;
        this.changebleDirectiveService.setValue(true);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private updateView(id: number): void {
        if (this.isEditing) {
            this.wrapperService.forceReload();
            this.wrapperService.dashboards$().pipe(skip(1), take(1)).subscribe(() => {
                this.pageService.load(String(id));
            });
        }
    }

}


