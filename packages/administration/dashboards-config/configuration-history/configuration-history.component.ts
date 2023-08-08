import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {ConfigHistoryModalComponent} from './config-history-modal/config-history-modal.component';
import {HistoryEvent} from './models/config-history.model';


@Component({
    selector: 'xm-configuration-history',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatTooltipModule, MatIconModule],
    templateUrl: './configuration-history.component.html',
    styleUrls: ['./configuration-history.component.scss'],
})
export class ConfigurationHistoryComponent {
    private dialogService = inject(MatDialog);
    private mockData: HistoryEvent[] = [
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

    public onClick(): void {
        this.dialogService.open(ConfigHistoryModalComponent,{width: '100vw', height: '100vh', maxWidth: '100vw', data: this.mockData });
    }
}

