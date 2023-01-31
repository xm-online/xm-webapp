import { Component } from '@angular/core';
import { XmTableComponent } from '../xm-table.component';
import { XmTableConfig } from '../interfaces/xm-table.model';

@Component({
    selector: 'xm-table-example',
    template: `
        <xm-table [config]="configExample"></xm-table>`,
    imports: [
        XmTableComponent,
    ],
    standalone: true,
})

export class XmTableExampleComponent {
    public configExample: Partial<XmTableConfig> = {
        title: 'Teams',
        filters: [],
        columns: [
            {
                selector: '@xm-ngx/components/text',
                title: 'Name',
                field: 'name',
                sortable: true,
                sticky: true,
            },
        ],
        collection: {
            type: 'repository',
            repository: {
                query: {
                    typeKey: 'TEAM',
                    sortBy: 'name',
                },
                resourceUrl: 'entity/api/xm-entities',
                resourceHandleKey: 'xm-entity',
            },
        },
    };
}

