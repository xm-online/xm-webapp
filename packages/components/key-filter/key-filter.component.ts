import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { XmDynamicModule, XmDynamicPresentation } from '@xm-ngx/dynamic';
import { NestedKeyFilters, searchNestedByPredicate } from '@xm-ngx/operators';
import { get } from 'lodash';

export interface XmKeyFilterConfig {
    key?: string;
    filters: NestedKeyFilters;
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
        const { filters, key } = this.config ?? {};

        if (!filters) {
            return;
        }

        const search = searchNestedByPredicate(this.value ?? [], this.config.filters);

        this.data = key
            ? get(search, key)
            : search;
    }
}
