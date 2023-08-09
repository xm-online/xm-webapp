import { Injectable, Type } from '@angular/core';
import { EntityCollectionBase, EntityCollectionFactoryService } from '@xm-ngx/repositories';
import { Dashboard, DashboardWidget } from '@xm-ngx/core/dashboard';

import { DASHBOARD_API_URL, DASHBOARD_WIDGET_API_URL } from './const';
import {Observable, of} from 'rxjs';
import {HistoryEvent} from '@xm-ngx/administration/dashboards-config/configuration-history/models/config-history.model';

export class DashboardConfig {
    public dashboardRef: Type<unknown>;
    public widgetRef: Type<unknown>;
    public EDIT_DASHBOARD_EVENT: string;
    public EDIT_WIDGET_EVENT: string;
}
export const mockData: HistoryEvent[] = [
    {
        user: 'James Webb',
        date: new Date(2023, 6, 25, 23, 45),
        config: '{ "age": "42", "menu": { "group": { "key": "TEST", "name": { "en": "Administration", "ru": "Администрирование", "uk": "Адміністрування" }, "orderIndex": 500, "icon": "settings" }, "name": { "en": "Administration", "ru": "Администрирование", "uk": "Адміністрування" } }, "slug": "admin-docs", "resourceUrl": null, "resourceHandle": null }',
    },
    {
        user: 'James Webb',
        date: new Date(2023, 6, 24, 23, 45),
        config: '{ "age": "42", "menu": { "group": { "key": "ROOT", "name": { "en": "Administration", "ru": "Администрирование", "uk": "Адміністрування" }, "orderIndex": 500, "icon": "settings" }, "name": { "en": "Administration", "ru": "Администрирование", "uk": "Адміністрування" } }, "slug": "admin-docs", "resourceUrl": null, "resourceHandle": null }',
    },
    {
        user: 'Bozon Higgsa',
        date: new Date(2023, 6, 23, 11, 23),
        config: '{ "name": { "en": "API", "ru": "API", "uk": "REST" }, "menu": { "group": { "key": "ROOT", "name": { "en": "Administration", "ru": "Администрирование", "uk": "Адміністрування" }, "orderIndex": 500, "icon": "settings" }, "name": { "en": "Administration", "ru": "Администрирование", "uk": "Адміністрування" } }, "slug": "admin-docs", "resourceUrl": null, "resourceHandle": null }',
    },
    {
        user: 'Nicolas Cage',
        date: new Date(2023, 5, 22, 8, 10),
        config: '{ "name": { "en": "API", "ru": "API", "uk": "API" }, "menu": { "group": { "key": "USERS", "name": { "en": "Administration", "ru": "Администрирование", "uk": "Адміністрування" }, "orderIndex": 500, "icon": "settings" }, "name": { "en": "Administration", "ru": "Администрирование", "uk": "Адміністрування" } }, "slug": "admin-docs", "resourceUrl": null, "resourceHandle": null }',
    },
    {
        user: 'Bozon Higgsa',
        date: new Date(2023, 5, 21, 15, 15),
        config: '{ "name": { "en": "API", "ru": "API", "uk": "API" }, "menu": { "group": { "key": "ADMINISTRATION", "name": { "en": "Administration", "ru": "Администрирование", "uk": "Адміністрування" }, "orderIndex": 500, "icon": "settings" }, "name": { "en": "Administration", "ru": "Администрирование", "uk": "Адміністрування" } }, "slug": "admin-docs", "resourceUrl": null, "resourceHandle": null }',
    },
    {
        user: 'Bozon Higssa',
        date: new Date(2023, 6, 20, 12, 45),
        config: '{ "name": { "en": "API", "ru": "API", "uk": "API" }, "orderIndex": 205, "menu": { "group": { "key": "ADMINISTRATION", "name": { "en": "Administration", "ru": "Администрирование", "uk": "Адміністрування" }, "orderIndex": 500, "icon": "settings" }, "name": { "en": "Administration", "ru": "Администрирование", "uk": "Адміністрування" } }, "slug": "admin-docs", "resourceUrl": null, "resourceHandle": null }',
    },
];


@Injectable()
export class DashboardCollection extends EntityCollectionBase<Dashboard> {
    constructor(factoryService: EntityCollectionFactoryService) {
        super(factoryService.create(DASHBOARD_API_URL));
    }
    public getHistoryById(id: number): Observable<HistoryEvent[]>{
        return of(mockData);
    }
}

@Injectable()
export class WidgetCollection extends EntityCollectionBase<DashboardWidget> {
    constructor(factoryService: EntityCollectionFactoryService) {
        super(factoryService.create(DASHBOARD_WIDGET_API_URL));
    }
    public getHistoryById(id: number): Observable<HistoryEvent[]>{
        return of(mockData);
    }
}

@Injectable()
export class WidgetHistoryCollection extends EntityCollectionBase<HistoryEvent> {
    constructor(factoryService: EntityCollectionFactoryService) {
        super(factoryService.create(DASHBOARD_WIDGET_API_URL));
    }
}
