import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import {
    XmDynamicPresentation,
    XmDynamicPresentationConstructor,
    XmDynamicPresentationEntryModule,
} from '@xm-ngx/dynamic';
import { defaults, get as _get, find as _find } from 'lodash';

export type PrimitiveValue = string | number | boolean;

export interface XmTableArrayOptions {
    predicate?: PrimitiveValue | Record<string, PrimitiveValue> | Array<PrimitiveValue>;
    fieldKey?: string;
}

export type XmTableArrayValue = unknown[];

@Component({
    selector: 'xm-table-array',
    template: '{{ data  }}',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmTableArrayComponent implements XmDynamicPresentation<XmTableArrayValue, XmTableArrayOptions> {
    private _value: XmTableArrayValue;

    @Input() public set value(value: XmTableArrayValue) {
        this._value = value;
        this.syncData();
    }

    public get value(): XmTableArrayValue {
        return this._value;
    }

    private _options: XmTableArrayOptions = {};

    @Input()
    public set options(value: XmTableArrayOptions) {
        this._options = defaults(value, {});
        this.syncData();
    }

    public get options(): XmTableArrayOptions {
        return this._options;
    }

    public data: PrimitiveValue;

    private syncData(): void {
        if (this.value && (
            this.options?.predicate || this.options.fieldKey
        )) {
            const found = _find(this.value, this.options.predicate);

            this.data = _get(found, this.options.fieldKey, null);
        }
    }
}

@NgModule({
    exports: [XmTableArrayComponent],
    declarations: [XmTableArrayComponent],
    imports: [CommonModule],
})
export class XmTableArrayModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmTableArrayComponent;
}
