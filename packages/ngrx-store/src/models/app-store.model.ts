import { Signal, Type } from '@angular/core';
import { StateSource } from '@ngrx/signals';

const APP_STORE_ACTION_PREFIX = 'APP_STORE_';

export type AppState = {
    user: any;
    dashboard: any;
};


export type AppStoreSourceType = Type<AppStoreSource>;

export type AppStoreSource = {
    user: Signal<any>,
    dashboard: Signal<any>,
    updateDashboard?: any,
    updateUser?: any,
} & StateSource<{}>;

export enum AppStoreActions {
    USER_UPDATE = APP_STORE_ACTION_PREFIX + 'USER_UPDATE',
    DASHBOARD_UPDATE = APP_STORE_ACTION_PREFIX + 'DASHBOARD_UPDATE',
}

