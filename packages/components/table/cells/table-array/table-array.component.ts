import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import {
    XmDynamicPresentation,
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
    imports: [CommonModule],
    standalone: true,
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

    private _config: XmTableArrayOptions = {};

    @Input()
    public set config(value: XmTableArrayOptions) {
        this._config = defaults(value, {});
        this.syncData();
    }

    public get config(): XmTableArrayOptions {
        return this._config;
    }

    public data: PrimitiveValue;

    private syncData(): void {
        if (this.value && (
            this.config?.predicate || this.config.fieldKey
        )) {
            const found = _find(this.value, this.config.predicate);

            this.data = _get(found, this.config.fieldKey, null);
        }
    }
}
