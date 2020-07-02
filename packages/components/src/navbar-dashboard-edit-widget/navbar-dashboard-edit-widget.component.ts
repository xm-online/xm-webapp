import { Component, NgModule, OnDestroy, OnInit, Type } from '@angular/core';
import {
    DashboardEditComponent,
    DashboardEditorService,
    DASHBOARDS_TRANSLATES,
    DashboardsExportService,
    DashboardsImportService,
    DashboardsManagerService,
    DashboardsModule,
    EDIT_DASHBOARD_EVENT,
    EDIT_WIDGET_EVENT,
} from '@xm-ngx/administration/dashboards-config';
import { XmEventManager } from '@xm-ngx/core';
import { Dashboard, DashboardWrapperService, PageService } from '@xm-ngx/dashboard';
import { XmSharedModule } from '@xm-ngx/shared';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

@Component({
    selector: 'xm-navbar-dashboard-edit-widget',
    template: `
        <button mat-icon-button
                *permitted="'DASHBOARD.CREATE'"
                [style.visibility]="page ? 'visible' : 'hidden'"
                [color]="isEditing ? 'primary' : undefined"
                [matTooltip]="TRS.editDashboard | translate" (click)="onEdit()">
            <mat-icon>edit</mat-icon>
        </button>
    `,
    providers: [
        DashboardEditorService,
        DashboardsExportService,
        DashboardsImportService,
        { provide: DashboardsManagerService, useValue: { setActiveWidget: () => null } },
    ],
})
export class NavbarDashboardEditWidgetComponent implements OnInit, OnDestroy {
    public TRS: typeof DASHBOARDS_TRANSLATES = DASHBOARDS_TRANSLATES;

    public page: Dashboard;
    public isEditing: boolean;

    constructor(
        protected readonly wrapperService: DashboardWrapperService,
        protected readonly eventManager: XmEventManager,
        private pageService: PageService,
        private editorService: DashboardEditorService,
    ) {
    }

    public ngOnInit(): void {
        this.editorService.close$.pipe(takeUntilOnDestroy(this)).subscribe(() => this.isEditing = false);
        this.pageService.active$().pipe(takeUntilOnDestroy(this)).subscribe((i) => {
            this.page = i as Dashboard;
            if (this.isEditing) {
                this.editorService.editDashboard(DashboardEditComponent, this.page);
            }
        });

        this.eventManager.listenTo(EDIT_DASHBOARD_EVENT)
            .pipe(takeUntilOnDestroy(this))
            .subscribe(({ id }) => this.updateView(id));

        this.eventManager.listenTo(EDIT_WIDGET_EVENT)
            .pipe(takeUntilOnDestroy(this))
            .subscribe(({ id }) => this.updateView(this.page.id));
    }

    public onEdit(): void {
        if (this.page && !this.isEditing) {
            this.isEditing = true;
            this.editorService.editDashboard(DashboardEditComponent, this.page);
        } else {
            this.isEditing = false;
            this.editorService.close();
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private updateView(id: number): void {
        if (this.isEditing) {
            this.wrapperService.forceReload();
            this.pageService.load(String(id));
        }
    }

}

@NgModule({
    imports: [XmSharedModule, DashboardsModule],
    exports: [NavbarDashboardEditWidgetComponent],
    declarations: [NavbarDashboardEditWidgetComponent],
    providers: [],
})
export class NavbarDashboardEditWidgetModule {
    public entry: Type<NavbarDashboardEditWidgetComponent> = NavbarDashboardEditWidgetComponent;
}
