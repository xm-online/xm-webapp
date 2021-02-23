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
import { DynamicBase } from '../dynamic-base';

export const TABLE_ROW = new InjectionToken<string>('TABLE_ROW');
export const TABLE_CELL = new InjectionToken<string>('TABLE_CELL');

/**
 * @beta
 */
export function getCellValue<V>(dynamicCell: DynamicCell, entity: unknown | V): V {
    const field = dynamicCell.field;
    if (field === null || field === undefined || field === '') {
        return entity as V;
    } else {
        return _.get(entity, field, null);
    }
}

/**
 * DynamicCellDirective cell configuration
 * @beta
 */
export interface DynamicCell<O = unknown> {
    field: string;
    selector: string;
    options: O;
    class: string;
    style: string;
}

/**
 * @deprecated use {@link DynamicCell} instead
 */
export type Column<O = unknown> = DynamicCell<O>;

/**
 * DynamicCellDirective creates a component from the DynamicLoader
 *
 * @example
 * <xm-dynamic-cell [row]="{c: true}"
 *                  [cell]="{field: 'c', selector='@xm-ngx/components/xm-bool-view'}"></xm-dynamic-cell>
 * @beta
 */
@Directive({
    selector: 'xm-dynamic-cell, [xmDynamicCell]',
})
export class DynamicCellDirective<V, O extends DynamicCell<O>>
    extends DynamicBase<V, O>
    implements OnInit, OnChanges, DoCheck {

    /** Component row value */
    @Input() public row: unknown;

    private _cell: O;

    public get cell(): O {
        return this._cell;
    }

    /** Cell options */
    @Input()
    public set cell(value: O) {
        this._cell = value;
        this.selector = value?.selector;
        this.options = value?.options;
        this.class = value?.class;
        this.style = value?.style;
    }

    /** @deprecated use {@link cell} instead */
    public get column(): O {
        return this.cell;
    }

    /** @deprecated use {@link cell} instead */
    @Input()
    public set column(value: O) {
        this.cell = value;
    }

    @Input()
    public getCellValue(): V | null {
        return getCellValue(this._cell, this.row);
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
                { provide: TABLE_CELL, useValue: this._cell },
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
