import { Injectable, Injector, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Id } from '@xm-ngx/components/entity-collection';
import { SidebarRightService } from '@xm-ngx/components/xm-sidebar-right';
import { Dashboard, Widget } from '@xm-ngx/dashboard';
import { XmToasterService } from '@xm-ngx/toaster';

@Injectable()
export class DashboardEditorService {

    constructor(public layoutService: SidebarRightService,
                protected router: Router,
                protected activatedRoute: ActivatedRoute,
                protected toasterService: XmToasterService,
                public injector: Injector) {
    }

    public close(): void {
        this.layoutService.close();
    }

    public editDashboard<T>(ref: Type<T>, item: Dashboard): void {
        this.openSidebar(ref, { value: item });
    }

    public editWidget<T>(ref: Type<T>, item: Widget): void {
        this.openSidebar(ref, { value: item });
    }

    public addWidget<T>(ref: Type<T>, value: { dashboard: { id: Id } }): void {
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
