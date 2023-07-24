import { Injectable, Injector, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarRightService } from '@xm-ngx/components/sidebar-right';
import { Dashboard, DashboardWidget } from '@xm-ngx/core/dashboard';
import { IId } from '@xm-ngx/interfaces';
import { XmToasterService } from '@xm-ngx/toaster';
import { Subject } from 'rxjs';

@Injectable()
export class DashboardEditorService {

    public isEdit: Subject<boolean> = new Subject<boolean>();
    constructor(public layoutService: SidebarRightService,
                protected router: Router,
                protected activatedRoute: ActivatedRoute,
                protected toasterService: XmToasterService,
                public injector: Injector) {
    }

    public close(): void {
        this.layoutService.close();
        sessionStorage.removeItem('NAVBAR_DASHBOARD_EDIT_STORAGE_KEY');
    }

    public isEditing(isEditing?: boolean): void {
        this.isEdit.next(isEditing);
    }

    public editDashboard<T>(ref: Type<T>, item: Dashboard): void {
        this.openSidebar(ref, { value: item });
    }

    public editWidget<T>(ref: Type<T>, item: DashboardWidget): void {
        this.openSidebar(ref, { value: item });
    }

    public addWidget<T>(ref: Type<T>, value: { dashboard: IId }): void {
        this.openSidebar(ref, { value });
    }

    public addDashboard<T>(ref: Type<T>): void {
        this.openSidebar(ref, { value: {} });
    }

    private openSidebar<T, D>(ref: Type<T>, data: D): void {
        const injector = this.resolveInjector();
        this.layoutService.open(ref, { data, width: '30vw', injector });
    }

    private resolveInjector(): Injector {
        return this.injector;
    }


}
