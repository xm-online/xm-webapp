import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    DashboardEditComponent,
    DashboardEditorService,
    DASHBOARDS_TRANSLATES,
    DashboardsExportService,
    DashboardsImportService,
    DashboardsManagerService,
    DashboardsModule,
    WidgetEditComponent,
} from '@xm-ngx/administration/dashboards-config';
import {
    DashboardCollection,
    DashboardConfig,
    WidgetCollection
} from '@xm-ngx/administration/dashboards-config/injectors';
import { Dashboard, PageService } from '@xm-ngx/dashboard';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { XmSharedModule } from "@xm-ngx/shared";

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
    imports: [XmSharedModule, DashboardsModule],
    providers: [
        DashboardCollection,
        WidgetCollection,
        DashboardsExportService,
        DashboardsImportService,
        {
            provide: DashboardConfig,
            useValue: {
                dashboardRef: DashboardEditComponent,
                widgetRef: WidgetEditComponent,
                EDIT_DASHBOARD_EVENT: NAVBAR_EDIT_DASHBOARD_EVENT,
                EDIT_WIDGET_EVENT: NAVBAR_EDIT_WIDGET_EVENT,
            },
        },
        { provide: DashboardsManagerService, useValue: { setActiveWidget: () => null } },
    ],
})
export class NavbarDashboardEditWidgetComponent implements OnInit, OnDestroy, XmDynamicWidget {
    @Input() public config: unknown;

    public TRS: typeof DASHBOARDS_TRANSLATES = DASHBOARDS_TRANSLATES;

    public page: Dashboard;
    public isEditing: boolean;

    constructor(
        private pageService: PageService,
        protected readonly dashboardConfig: DashboardConfig,
        private editorService: DashboardEditorService,
    ) {
    }

    public ngOnInit(): void {
        this.editorService.state().subscribe(state => {
            this.isEditing = state;
        })
        this.pageService.active$().pipe(takeUntilOnDestroy(this)).subscribe((i) => {
            this.page = i as Dashboard;
            if (this.isEditing) {
                this.editorService.editDashboard(this.dashboardConfig.dashboardRef, this.page);
            } else if (sessionStorage.getItem(NAVBAR_DASHBOARD_EDIT_STORAGE_KEY) === NavbarDashboardEditState.Open) {
                this.onEdit();
            }
        });
    }

    public onEdit(): void {
        if (this.page && !this.isEditing) {
            this.isEditing = true;
            this.editorService.editDashboard(this.dashboardConfig.dashboardRef, this.page);
            sessionStorage.setItem(NAVBAR_DASHBOARD_EDIT_STORAGE_KEY, NavbarDashboardEditState.Open);
        } else {
            this.isEditing = false;
            sessionStorage.removeItem(NAVBAR_DASHBOARD_EDIT_STORAGE_KEY);
            this.editorService.close();
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}


