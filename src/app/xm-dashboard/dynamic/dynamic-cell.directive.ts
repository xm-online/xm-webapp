import {
    ComponentFactoryResolver,
    Directive,
    DoCheck,
    InjectionToken,
    Injector,
    Input,
    NgModule,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';
import * as _ from 'lodash';
import { DynamicLoader } from './loader/dynamic-loader';
import { DynamicViewDirective, IComponentFn } from './view/dynamic-view.directive';

export const TABLE_ROW = new InjectionToken<string>('TABLE_ROW');
export const TABLE_COLUMN = new InjectionToken<string>('TABLE_COLUMN');

export interface Column {
    field: string;
}

export interface Component {
    value: unknown;
    options: unknown;
}

/**
 * DynamicCellDirective creates a component from the DynamicLoader
 * @example
 * <xm-dynamic-cell [row]="{c: true}"
 *                  [column]="{field: 'c'}"
 *                  [selector]="'@xm-ngx/components/xm-bool-view'"></xm-dynamic-cell>
 */
@Directive({
    selector: 'xm-dynamic-cell, [xmDynamicCell]',
})
export class DynamicCellDirective<V, O extends Column>
    extends DynamicViewDirective<V, O>
    implements OnInit, OnChanges, DoCheck {

    /** Component row value */
    @Input() public row: unknown;
    /** Component Column options */
    @Input() public column: O;
    /** Component ref */
    @Input() public selector: IComponentFn<V, O> | string;

    constructor(
        viewContainerRef: ViewContainerRef,
        injector: Injector,
        loaderService: DynamicLoader,
        cfr: ComponentFactoryResolver,
    ) {
        super(viewContainerRef, injector, loaderService, cfr);
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes.row) {
            this.updateValue();
        }
        if (changes.column) {
            this.updateOptions();
        }
    }

    public getCellValue(): V {
        return _.get(this.row, this.column.field);
    }

    public createInjector(): Injector {
        return Injector.create({
            providers: [
                {provide: TABLE_ROW, useValue: this.row},
                {provide: TABLE_COLUMN, useValue: this.column},
            ],
            parent: this.injector,
        });
    }

    public ngDoCheck(): void {
        if (this.value !== this.getCellValue()) {
            this.updateValue();
        }
    }

    protected updateValue(): void {
        if (!this.instance) {
            return;
        }
        this.instance.value = this.value = this.getCellValue();
    }

    protected updateOptions(): void {
        if (!this.instance) {
            return;
        }
        this.instance.options = this.options = this.column;
    }

}

@NgModule({
    imports: [],
    exports: [DynamicCellDirective],
    declarations: [DynamicCellDirective],
    providers: [],
})
export class DynamicCellModule {
}
