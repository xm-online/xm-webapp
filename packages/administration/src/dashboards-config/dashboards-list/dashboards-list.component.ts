import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { expand } from '@xm-ngx/components/animations';
import { XmEventManager } from '@xm-ngx/core';
import { Dashboard } from '@xm-ngx/dashboard';
import * as _ from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, finalize, map } from 'rxjs/operators';
import { ACTIONS_COLUMN, DASHBOARDS_TRANSLATES, EDIT_DASHBOARD_EVENT } from '../const';
import { DashboardEditComponent } from '../dashboard-edit/dashboard-edit.component';
import { DashboardEditorService } from '../dashboard-editor.service';
import { DashboardsManagerService } from '../dashboards-manager.service';
import { DashboardCollection } from '../injectors';
import { DashboardsExportService } from './dashboards-export.service';
import { DashboardsImportService } from './dashboards-import.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

const EXPORT_FILENAME = 'dashboards';
const DISPLAYED_COLUMNS = [
    'orderIndex',
    'name',
    'config',
    'layout',
    'hidden',
    ACTIONS_COLUMN,
];
const columnMap = {
    hidden: 'config.hidden',
};

@Component({
    selector: 'xm-dashboards-list',
    templateUrl: './dashboards-list.component.html',
    styleUrls: ['./dashboards-list.component.scss'],
    animations: [
        expand,
    ],
    providers: [DashboardEditorService, DashboardsExportService, DashboardsImportService, DashboardsManagerService],
})
export class DashboardsListComponent implements OnInit {
    public TRS: typeof DASHBOARDS_TRANSLATES = DASHBOARDS_TRANSLATES;
    public readonly ACTIONS_COLUMN: typeof ACTIONS_COLUMN = ACTIONS_COLUMN;
    public readonly EXPANDED_DETAIL: string = '_expandedDetail';
    public columns: typeof DISPLAYED_COLUMNS = DISPLAYED_COLUMNS;

    public dashboardList: MatTableDataSource<Dashboard>;
    public loading$: Observable<boolean>;

    public expandedElement: Dashboard;
    public expanded: boolean = true;

    public isUpdateIndexRequired = false;

    constructor(
        protected dashboardService: DashboardCollection,
        protected activatedRoute: ActivatedRoute,
        protected eventManager: XmEventManager,
        protected dashboardsExportService: DashboardsExportService,
        protected dashboardsImportService: DashboardsImportService,
        protected editorService: DashboardEditorService,
        public managerService: DashboardsManagerService,
    ) {
    }

    public onUpdateIndexes(): void {
        this.dashboardList.data.forEach(dashboard => {
            this.dashboardService.update(dashboard).subscribe();
        });
        this.isUpdateIndexRequired = false;
    }

    public ngOnInit(): void {
        this.loading$ = combineLatest([
            this.dashboardService.loading$,
            this.dashboardsImportService.loading$,
        ]).pipe(
            map(([a, b]) => a || b),
            debounceTime(700),
        );

        this.dashboardList = new MatTableDataSource([]);

        this.eventManager.listenTo(EDIT_DASHBOARD_EVENT).subscribe((e) => {
            if (e.delete || e.add || e.edit) {
                this.load();
            }
        });

        this.load();
    }

    public load(): void {
        const sortDashboards = (dashboards: Dashboard[]): Dashboard[] => _.sortBy(dashboards, ['config.menu.group.orderIndex', 'config.orderIndex']);

        // TODO: after receiver the data scroll to last selected row
        this.dashboardService.getAll().pipe(
            map(sortDashboards),
        ).subscribe((dashboards) => {
            this.dashboardList.data = dashboards;
            this.loadToEditor();
        });
    }

    public onAdd(): void {
        this.editorService.addDashboard(DashboardEditComponent);
    }

    public onImport(files: FileList): void {
        if (!files || !files[0]) {
            console.warn('File is not selected!');
            return;
        }
        this.dashboardsImportService.import(files[0]).pipe(finalize(this.load.bind(this))).subscribe();
    }

    public onExport(): void {
        this.dashboardsExportService.exportToFile(EXPORT_FILENAME);
    }

    public onEdit(item: Dashboard): void {
        this.expandedElement = item;
        this.editorService.editDashboard(DashboardEditComponent, item);
        this.managerService.setActiveDashboard(item);
    }

    public toggleExpand(): void {
        this.expanded = !this.expanded;
    }

    public onFilter(filterValue: string): void {
        this.dashboardList.filter = filterValue.trim().toLowerCase();
    }

    public fromMap(source: any, key: string): any {
        return _.get(source, columnMap[key]);
    }

    public dropRow(event: CdkDragDrop<MatTableDataSource<Dashboard>, unknown>): void {
        const currentIndex = event.currentIndex;
        const prevIndex = this.dashboardList.data.findIndex((d) => d === event.item.data);
        moveItemInArray(this.dashboardList.data, prevIndex, currentIndex);
        this.dashboardList.data.forEach((dashboard, ix) => dashboard.config.orderIndex = ix + 1);
        this.dashboardList.data = [...this.dashboardList.data];
        this.isUpdateIndexRequired = true;
    }

    private loadToEditor(): void {
        if (this.managerService.activeDashboard) {
            const edit = this.dashboardList.data.find(d => d.id === this.managerService.activeDashboard.id);
            if (edit) {
                this.onEdit(edit);
            }
        }
    }
}
