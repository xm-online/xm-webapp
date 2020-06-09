import { Injectable, Injector, OnDestroy, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Id } from '@xm-ngx/components/entity-collection';
import { Dashboard, Widget } from '@xm-ngx/dynamic';
import { XmToasterService } from '@xm-ngx/toaster';
import { Subject } from 'rxjs';
import { SidebarRightService } from '../../../../src/app/modules/xm-sidebar-right';
import { DashboardsManagerService } from './dashboards-manager.service';
import { DashboardCollection, WidgetCollection } from './injectors';

@Injectable()
export class DashboardEditorService implements OnDestroy {
    public readonly close$: Subject<void> = new Subject<void>();

    constructor(public layoutService: SidebarRightService,
                protected router: Router,
                protected activatedRoute: ActivatedRoute,
                protected toasterService: XmToasterService,
                public injector: Injector) {
    }

    public ngOnDestroy(): void {
        this.close$.complete();
    }

    public close(): void {
        this.layoutService.close();
        this.close$.next();
    }

    public editDashboard<T>(ref: Type<T>, item: Dashboard): void {
        this.openSidebar(ref, {value: item});
    }

    public editWidget<T>(ref: Type<T>, item: Widget): void {
        this.openSidebar(ref, {value: item});
    }

    public addWidget<T>(ref: Type<T>, value: { dashboard: { id: Id } }): void {
        this.openSidebar(ref, {value});
    }

    public addDashboard<T>(ref: Type<T>): void {
        this.openSidebar(ref, {value: {}});
    }

    private openSidebar<T, D>(ref: Type<T>, data: D): void {
        const injector = this.resolveInjector();
        this.layoutService.open(ref, {data, width: '30vw', injector});
    }

    private resolveInjector(): Injector {
        return Injector.create([
            {provide: DashboardCollection, useValue: this.injector.get(DashboardCollection)},
            {provide: WidgetCollection, useValue: this.injector.get(WidgetCollection)},
            {provide: DashboardEditorService, useValue: this},
            {provide: DashboardsManagerService, useValue: {setActiveWidget: () => undefined, activeWidget: {}}},
            {provide: XmToasterService, useValue: this.toasterService},
        ]);
    }


}
