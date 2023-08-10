import { Injectable, Injector, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarRightService } from '@xm-ngx/components/sidebar-right';
import { Dashboard, DashboardWidget } from '@xm-ngx/core/dashboard';
import { IId } from '@xm-ngx/interfaces';
import { XmToasterService } from '@xm-ngx/toaster';
import { Observable, Subject } from 'rxjs';
import { readFromClipboard } from '@xm-ngx/operators';
import * as _ from 'lodash';

const NAVBAR_DASHBOARD_EDIT_STORAGE_KEY = 'NAVBAR_DASHBOARD_EDIT_STORAGE_KEY';

export enum XM_WEBAPP_OPERATIONS {
    COPY = 'XM_WEBAPP_COPY_OBJECT',
}

export enum CONFIG_TYPE {
    DASHBOARD = 'DASHBOARD',
    WIDGET = 'WIDGET',
}

export interface CopiedObject {
    type: XM_WEBAPP_OPERATIONS,
    configType: CONFIG_TYPE,
    config: Dashboard,
}


@Injectable()
export class DashboardEditorService {

    private isEdit: Subject<boolean> = new Subject<boolean>();
    constructor(public layoutService: SidebarRightService,
                protected router: Router,
                protected activatedRoute: ActivatedRoute,
                protected toasterService: XmToasterService,
                public injector: Injector) {
    }

    public close(): void {
        this.layoutService.close();
        sessionStorage.removeItem(NAVBAR_DASHBOARD_EDIT_STORAGE_KEY);
        this.changeEditState();
    }

    public changeEditState(): Observable<boolean> {
        this.isEdit.next(!!sessionStorage.getItem(NAVBAR_DASHBOARD_EDIT_STORAGE_KEY));
        return this.isEdit;
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

    public async pasteConfigFromClipboard<T>(ref: Type<T>): Promise<void> {
        const text = await readFromClipboard();

        let config: Dashboard;
        let value: Dashboard = {};

        if (_.isString(text)) {
            try {
                config = JSON.parse(text);
            } catch (e) {
                console.warn(e);
                return;
            }
        } else if (_.isObject(text)) {
            config = text as Dashboard;
        }

        delete config.id;
        config.widgets = this.getUnbindedWidgets(config.widgets);

        value = _.merge(value, config);
        this.openSidebar(ref, { value: value });

    }


    public async checkObjectInClipboard(): Promise<CopiedObject | null> {
        const text = await readFromClipboard();

        let object: {type: XM_WEBAPP_OPERATIONS, configType: CONFIG_TYPE, config: Dashboard};

        if (_.isString(text)) {
            try {
                object = JSON.parse(text);
            } catch (e) {
                console.warn(e);
                return null;
            }
        } else if (_.isObject(text)) {
            object.config = text as Dashboard;
        }

        return object;
    }

    private openSidebar<T, D>(ref: Type<T>, data: D): void {
        const injector = this.resolveInjector();
        this.layoutService.open(ref, { data, width: '30vw', injector });
    }

    private resolveInjector(): Injector {
        return this.injector;
    }

    private getUnbindedWidgets(widgets: DashboardWidget[]): DashboardWidget[] {
        return widgets.map((w) => {
            delete w.id;
            delete w.dashboard;
            return w;
        });
    }

}
