import {
    Directive,
    DoCheck,
    InjectionToken,
    Injector,
    Input,
    NgModule,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import * as _ from 'lodash';
import { DynamicBase } from './dynamic-base';

export const TABLE_ROW = new InjectionToken<string>('TABLE_ROW');
export const TABLE_COLUMN = new InjectionToken<string>('TABLE_COLUMN');

export interface Column<O = unknown> {
    field: string;
    selector: string;
    options: O;
}

/**
 * DynamicCellDirective creates a component from the DynamicLoader
 * @example
 * <xm-dynamic-cell [row]="{c: true}"
 *                  [column]="{field: 'c', selector='@xm-ngx/components/xm-bool-view'}"></xm-dynamic-cell>
 */
@Directive({
    selector: 'xm-dynamic-cell, [xmDynamicCell]',
})
export class DynamicCellDirective<V, O extends Column<O>>
    extends DynamicBase<V, O>
    implements OnInit, OnChanges, DoCheck {

    /** Component row value */
    @Input() public row: unknown;

    private _column: O;

    public get column(): O {
        return this._column;
    }

    /** Component Column options */
    @Input()
    public set column(value: O) {
        this._column = value;
        this.selector = value?.selector;
        this.options = value?.options;
    }

    @Input()
    public getCellValue(): V | null {
        return _.get(this.row, this._column.field, null);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes.row) {
            this.value = this.getCellValue();
            this.updateValue();
        }
        if (changes.column) {
            this.updateOptions();
            this.value = this.getCellValue();
            this.updateValue();
        }
    }

    public createInjector(): Injector {
        return Injector.create({
            providers: [
                { provide: TABLE_ROW, useValue: this.row },
                { provide: TABLE_COLUMN, useValue: this._column },
            ],
            parent: this.injector,
        });
    }

    public ngDoCheck(): void {
        const newValue = this.getCellValue();

        if (this.value !== newValue) {
            this.value = newValue;
            this.updateValue();
        }
    }

}

@NgModule({
    exports: [DynamicCellDirective],
    declarations: [DynamicCellDirective],
})
export class DynamicCellModule {
}
