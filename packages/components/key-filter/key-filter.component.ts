import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { XmDynamicModule, XmDynamicPresentation } from '@xm-ngx/dynamic';
import { searchByPropertyPath, NestedKeyFilters, searchNestedByPredicate } from '@xm-ngx/operators';
import { get } from 'lodash';

export interface XmKeyFilterConfig {
    key?: string;
    filters: NestedKeyFilters;
    propertyPath?: string;
    dynamic?: XmDynamicPresentation;
}
export type XmKeyFilterValue = unknown[];

@Component({
    standalone: true,
    selector: 'xm-key-filter',
    template: `
        @if (config?.dynamic; as dynamic) {
            <ng-container
                [class]="dynamic?.class"
                [style]="dynamic?.style"
                xmDynamicPresentation
                [selector]="dynamic?.selector"
                [config]="dynamic?.config"
                [value]="data"
                [controllers]="dynamic?.controllers"></ng-container>
        }
    `,
    imports: [
        XmDynamicModule,
    ],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmKeyFilterComponent implements XmDynamicPresentation<XmKeyFilterValue, XmKeyFilterConfig>, OnChanges {
    @Input() public value: XmKeyFilterValue;
    @Input() public config: XmKeyFilterConfig;

    public data?: unknown;

    public ngOnChanges(): void {
        const { filters, key, propertyPath } = this.config ?? {};

        if (!filters) {
            return;
        }

        const value = this.value ?? [];
        const filteredValue = propertyPath
            ? searchByPropertyPath(value, propertyPath)
            : value;

        const search = searchNestedByPredicate(filteredValue, this.config.filters);

        this.data = key
            ? get(search, key)
            : search;
    }
}
