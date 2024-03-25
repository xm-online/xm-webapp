import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

const NAVBAR_DASHBOARD_EDIT_STORAGE_KEY = 'NAVBAR_DASHBOARD_EDIT_STORAGE_KEY';

@Injectable({
    providedIn: 'root',
})
export class ChangebleDirectiveService {
    private isEdit: Subject<boolean> = new Subject<boolean>();

    constructor() {
    }

    public getEditStorageState(): boolean {
        return !!sessionStorage.getItem(NAVBAR_DASHBOARD_EDIT_STORAGE_KEY);
    }

    public setValue(value: boolean): void {
        this.isEdit.next(value);
    }

    public getValue(): Observable<boolean> {
        return this.isEdit.asObservable();
    }


    public getUpdatedDashboardWithWidget(dashboard: any, result: any): any {
        dashboard.layout.layout.forEach(layout => {
            const widgetIndex = layout.content.findIndex(({widget}) => widget?.id === result.widget?.id);
            if (widgetIndex !== -1) {
                layout.content[widgetIndex].class = result.class;
            }
        });
        dashboard.layout.layout.forEach((layout) => {
            layout.content.forEach((widget) => {
                delete widget.widget;
            });
        });
        delete dashboard.widgets;
        delete dashboard.layout.grid;
        return dashboard;
    }
}
