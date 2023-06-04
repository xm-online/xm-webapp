import { Injectable, Injector, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarRightService } from '@xm-ngx/components/sidebar-right';
import { Dashboard, DashboardWidget } from '@xm-ngx/dashboard';
import { IId } from '@xm-ngx/shared/interfaces';
import { XmToasterService } from '@xm-ngx/toaster';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DashboardEditorService {

    private state$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(public layoutService: SidebarRightService,
                protected router: Router,
                protected activatedRoute: ActivatedRoute,
                protected toasterService: XmToasterService,
                public injector: Injector) {
        this.state$.subscribe(state => {
            if (state) {
                console.log('sidebar open');
            } else {
                console.log('sidebar close');
            }
        })
    }

    public state(): Observable<boolean> {
        return this.state$.asObservable();
    }

    public close(): void {
        this.state$.next(false);
        this.layoutService.close();
    }

    public editDashboard<T>(ref: Type<T>, item: Dashboard): void {
        this.openSidebar(ref, {value: item});
    }

    public editWidget<T>(ref: Type<T>, item: DashboardWidget): void {
        this.openSidebar(ref, {value: item});
    }

    public addWidget<T>(ref: Type<T>, value: { dashboard: IId }): void {
        this.openSidebar(ref, {value});
    }

    public addDashboard<T>(ref: Type<T>): void {
        this.openSidebar(ref, {value: {}});
    }

    private openSidebar<T, D>(ref: Type<T>, data: D): void {
        this.state$.next(true);
        const injector = this.resolveInjector();
        this.layoutService.open(ref, {data, width: '30vw', injector});
    }

    private resolveInjector(): Injector {
        return this.injector;
    }
}
