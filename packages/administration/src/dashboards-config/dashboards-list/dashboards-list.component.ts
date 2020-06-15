import { Component, OnInit, ViewChild } from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { expand } from '@xm-ngx/components/animations';
import { XmEventManager } from '@xm-ngx/core';
import { Dashboard } from '@xm-ngx/dynamic';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ACTIONS_COLUMN, DASHBOARDS_TRANSLATES, EDIT_DASHBOARD_EVENT } from '../const';
import { DashboardEditComponent } from '../dashboard-edit/dashboard-edit.component';
import { DashboardEditorService } from '../dashboard-editor.service';
import { DashboardsManagerService } from '../dashboards-manager.service';
import { DashboardCollection } from '../injectors';
import { DashboardsExportService } from './dashboards-export.service';
import { DashboardsImportService } from './dashboards-import.service';

const EXPORT_FILENAME = 'dashboards';
const DISPLAYED_COLUMNS = [
    'name',
    'slug',
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
        matExpansionAnimations.indicatorRotate,
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

    @ViewChild(MatSort, {static: true}) protected sort: MatSort;

    constructor(
        protected dashboardService: DashboardCollection,
        protected activatedRoute: ActivatedRoute,
        protected readonly eventManager: XmEventManager,
        public readonly dashboardsExportService: DashboardsExportService,
        public readonly dashboardsImportService: DashboardsImportService,
        public editorService: DashboardEditorService,
        public managerService: DashboardsManagerService,
    ) {
    }

    public ngOnInit(): void {
        this.loading$ = this.dashboardService.loading$;
        this.dashboardList = new MatTableDataSource([]);
        this.dashboardList.sort = this.sort;

        this.eventManager.listenTo(EDIT_DASHBOARD_EVENT).subscribe((e) => {
            if (e.delete || e.add || e.edit) {
                this.load();
            }
        });

        this.load();
    }

    public load(): void {
        const sortDashboards = (dashboards: Dashboard[]): Dashboard[] => {
            return _.sortBy(dashboards, ['config.menu.group.orderIndex', 'config.orderIndex']);
        };

        // TODO: after receiver the data scroll to last selected row
        this.dashboardService.getAll().pipe(
            map(sortDashboards),
        ).subscribe((i) => {
            this.dashboardList.data = i;
            this.loadToEditor();
        });
    }

    public onAdd(): void {
        this.editorService.addDashboard(DashboardEditComponent);
    }

    public onImport(files: FileList): void {
        if (!files || !files[0]) {
            return console.warn('File is not selected!');
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

    private loadToEditor(): void {
        if (this.managerService.activeDashboard) {
            const edit = this.dashboardList.data.find(d => d.id === this.managerService.activeDashboard.id);
            if (edit) {
                this.onEdit(edit);
            }
        }
    }
}
