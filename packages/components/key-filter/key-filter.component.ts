import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { KeyFilterController, XmKeyFilterConfig, XmKeyFilterValue } from '../../components/key-filter/key-filter.model';
import { injectByKey, XmDynamicModule, XmDynamicPresentation } from '@xm-ngx/dynamic';
import { searchNestedByPredicate } from '@xm-ngx/operators';
import { get, isArray } from 'lodash';

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
    private keyFilterController: KeyFilterController = injectByKey<KeyFilterController>(
        'key-filter-controller',
        { optional: true },
    );

    @Input() public value: XmKeyFilterValue;
    @Input() public config: XmKeyFilterConfig;

    public data?: unknown;

    public ngOnChanges(): void {
        const { filters, key } = this.config ?? {};

        if (!filters) {
            return;
        }

        const value = this.prepareValue();

        const search = searchNestedByPredicate(value, this.config.filters);

        this.data = key
            ? get(search, key)
            : search;
    }

    public prepareValue(): XmKeyFilterValue {
        const value = this.value ? (isArray(this.value) ? this.value: [this.value]): [];

        if (this.keyFilterController?.prepareValue) {
            return this.keyFilterController.prepareValue(this.value, this.config);
        }

        return value;
    }
}
