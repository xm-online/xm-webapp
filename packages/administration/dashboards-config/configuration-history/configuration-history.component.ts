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
            user: 'User1',
            date: new Date(2023, 6, 26),
            config: '{ "param1": "value1", "param2": "value2" }',
        },
        {
            user: 'User2',
            date: new Date(2023, 6, 25),
            config: '{ "setting1": true, "setting2": false }',
        },
        {
            user: 'User3',
            date: new Date(2023, 6, 24),
            config: '{ "key1": "value3", "key2": "value4" }',
        },
        {
            user: 'User4',
            date: new Date(2023, 6, 23),
            config: '{ "option1": "optionA", "option2": "optionB" }',
        },
        {
            user: 'User5',
            date: new Date(2023, 6, 22),
            config: '{ "attribute1": "attr1", "attribute2": "attr2" }',
        },
        {
            user: 'User6',
            date: new Date(2023, 6, 21),
            config: '{ "feature1": "enabled", "feature2": "disabled" }',
        },
        {
            user: 'User7',
            date: new Date(2023, 6, 20),
            config: '{ "property1": "prop1", "property2": "prop2" }',
        },
    ];

    public onClick(): void {
        this.dialogService.open(ConfigHistoryModalComponent,{width: '100vw', height: '100vh', maxWidth: '100vw', data: this.mockData });
    }
}

