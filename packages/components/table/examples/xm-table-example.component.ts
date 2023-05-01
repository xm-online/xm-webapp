import { Component } from '@angular/core';
import { XmTableComponent } from '../table/xm-table.component';
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
                name: 'name',
                dataClass: 'string',
                dataStyle: 'data',
                class: 'data',
                style: 'data',
            },
        ],
        collection: {
            type: 'repository',
            repository: {
                config: {
                    query: {
                        typeKey: 'TEAM',
                        sortBy: 'name',
                    },
                    resourceUrl: 'entity/api/xm-entities',
                },
                selector: '@xm-ngx/components/entity-repository',
            },
        },
    };
}

