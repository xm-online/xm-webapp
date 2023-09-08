import { Component, Input, inject } from '@angular/core';
import { XmTableWidgetConfig, XmTableWidget, XmTableSettingStore, XmTableColumn } from '@xm-ngx/components/table';
import { EntityTableAdaptConfig } from './entity-table.model';
import { set } from 'lodash';
import { FastSearchSpec } from '@xm-ngx/core/entity';
import { DeepPartial } from '@xm-ngx/interfaces';
import { XmDynamicPresentationLayout } from '@xm-ngx/dynamic';
import { FormLayoutItem } from '@xm-ngx/components/form-layout';

@Component({
    standalone: true,
    selector: 'xm-entity-table',
    imports: [
        XmTableWidget,
    ],
    template: `
        <xm-table-widget [config]="config"></xm-table-widget>
    `,
})
export class XmEntityTableComponent {
    public config: DeepPartial<XmTableWidgetConfig>;

    private xmTableSettingStore = inject(XmTableSettingStore);

    @Input() public hideActionsMenu = false;
    @Input() public hideDeleteButton = false;

    @Input() 
    public set adaptConfig(widgetConfig: EntityTableAdaptConfig) {
        const tableStorageKey = 'application-table';

        this.xmTableSettingStore.clearStore(tableStorageKey);

    
        const { typeKey } = (widgetConfig ?? {});

        const actions = this.buildTableActions(widgetConfig);
        const columns = this.buildTableColumns(widgetConfig);
        const filters = this.buildTableFilters(widgetConfig);

        this.config = {
            pageableAndSortable: {
                pageSize: 10,
                sortBy: 'id',
                sortOrder: 'desc',
                pageSizeOptions: [
                    10,
                    20,
                    50,
                ],
                hidePagination: false,
            },
            storageKey: tableStorageKey,
            actions,
            columns,
            filters,
            collection: {
                type: 'repository',
                repository: {
                    selector: '@xm-ngx/components/entity-repository',
                    config: {
                        useOnlySpecifiedParams: true,
                        paramsToRequest: {
                            page: 'queryParams.pageIndex',
                            size: 'queryParams.pageSize',
                            sort: "queryParams.sortBy + ',' + queryParams.sortOrder",
                            query: `(!!queryParams.query) ? queryParams.query : 'typeKey:${typeKey}*'`,
                            typeKey: `"${typeKey}"`,
                        },
                        resourceUrl: 'entity/api/_search/v2/xm-entities',
                    },
                },
            },
        } as DeepPartial<XmTableWidgetConfig>;
    }
    
    private buildTableActions(widgetConfig: EntityTableAdaptConfig): XmDynamicPresentationLayout[] {
        const { typeKey, xmEntitySpec } = (widgetConfig ?? {});
        const { functions } = xmEntitySpec;
        
        const actions: XmDynamicPresentationLayout[] = [];

        if (!this.hideActionsMenu) {
            actions.push(
                {
                    selector: '@xm-ngx/components/application-table-menu',
                    config: {
                        typeKey,
                        functions,
                    },
                },
            );
        }

        return actions;
    }

    private buildTableFilters(widgetConfig: EntityTableAdaptConfig): DeepPartial<FormLayoutItem>[] {
        const { fastSearch } = (widgetConfig ?? {});

        const chips = fastSearch?.length > 0 
            ? [{
                name: 'ALL',
                query: '',
                key: '',
            } as FastSearchSpec].concat(...fastSearch).map((value) => {
                return {
                    title: value.name,
                    value: value.query,
                };
            })
            : [];


        return chips?.length > 0 ? [
            {
                selector: '@xm-ngx/components/chips-control',
                options: {
                    multiple: false,
                    items: chips,
                },
                name: 'query',
            },
        ] : [];
    }

    private buildTableColumns(widgetConfig: EntityTableAdaptConfig): DeepPartial<XmTableColumn[]> {
        const { routerLink, noDeepLink, fields, xmEntitySpec } = (widgetConfig ?? {});
        const { functions } = xmEntitySpec;

        const fieldsAsColumn =
            !this.hideDeleteButton 
                ? fields.concat({'field': 'deleteButton', sortable: false, title: '' })
                : fields;

        return fieldsAsColumn?.reduce<DeepPartial<XmTableColumn[]>>((acc, field) => {
            const column = {
                selector: '@xm-ngx/components/text',
                field: field.field,
                title: field.title,
                sortable: field?.sortable != false,
            };

            if (field.field === 'name') {
                set(column, 'selector', '@xm-ngx/components/application-table-link');
                set(column, 'config', {
                    routerLink,
                    noDeepLink,
                });
            } else if (field.field === 'stateKey') {
                set(column, 'selector', '@xm-ngx/components/application-table-state');
            } else if (field.field === 'startDate' || field.field === 'updateDate') {
                set(column, 'selector', '@xm-ngx/components/date');
                set(column, 'config', {
                    format: 'MM/dd/yy hh:mm',
                });
            } else if (field.field === 'action' && field.action) {
                set(column, 'selector', '@xm-ngx/components/application-table-actions');
                set(column, 'config', {
                    actions: [field.action],
                    functions,
                });
            } else if (field.field === 'actions' && field.actions?.length > 0) {
                set(column, 'selector', '@xm-ngx/components/application-table-actions');
                set(column, 'config', {
                    actions: field.actions,
                    actionsListPrivileges: field.actionsListPrivileges,
                    functions,
                });
            } else if (field.field === 'deleteButton') {
                set(column, 'name', 'deleteButton');
                set(column, 'selector', '@xm-ngx/components/application-table-delete-button');
                set(column, 'config', {
                    pathAsDeleteId: 'id',
                });
            }

            return [
                ...acc,
                column,
            ];
        }, []);
    }
}