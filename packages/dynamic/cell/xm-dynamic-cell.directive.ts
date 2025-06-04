/* eslint-disable @angular-eslint/no-conflicting-lifecycle */
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
import {
    XmDynamicControllerInjectorFactoryService,
} from '../src/services/xm-dynamic-controller-injector-factory.service';
import { getValue } from '@xm-ngx/operators';
import * as _ from 'lodash';
import { XmDynamicPresentationBase } from '../presentation';
import { XmDynamicLayoutNode } from '../src/interfaces';


export const XM_DYNAMIC_TABLE_ROW = new InjectionToken<unknown>('XM_DYNAMIC_TABLE_ROW');
export const XM_DYNAMIC_TABLE_CELL = new InjectionToken<unknown>('XM_DYNAMIC_TABLE_CELL');

/**
 * XmDynamicCellDirective cell configuration
 * @beta
 */
export interface XmDynamicCell<C = unknown> extends XmDynamicLayoutNode<C> {
    field: string;
}

/**
 * XmDynamicCellDirective creates a component from the DynamicLoader
 *
 * @example
 * ```
 * <xm-dynamic-cell [row]="{c: true}"
 *                  [cell]="{field: 'c', selector='@xm-ngx/components/xm-bool-view'}"></xm-dynamic-cell>
 * ```
 * @beta
 */
@Directive({
    selector: 'xm-dynamic-cell, [xmDynamicCell]',
    providers: [XmDynamicControllerInjectorFactoryService],
})
export class XmDynamicCellDirective<V, O extends XmDynamicCell<O>>
    extends XmDynamicPresentationBase<V, O>
    implements OnInit, OnChanges, DoCheck {
    private readonly SKELETON_SELECTOR = '@xm-ngx/components/skeleton';

    /** Component row value */
    @Input() public row: unknown;
    @Input() public isLoading: boolean = false;
    @Input() public isSkeletonLoading: boolean = false;

    private _cell: O;

    public get cell(): O {
        return this._cell;
    }

    /** Cell options */
    @Input()
    public set cell(value: O) {
        this._cell = value;
        this.selector = this.getSelector(value);
        this.options = value?.options;
        this.config = this.getConfig(value);
        this.style = this.getStyle(value?.style);
        this.class = this.getClass(value?.class);
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
        return getValue(this.row, this._cell.field);
    }

    private getStyle(style?: string): string {
        if (style?.includes('${')) {
            try {
                style = _.template(style ?? '')(this.row as object ?? {});
            } catch (e) {
                console.warn(e);
            }
        }

        return style;
    }

    private getClass(classNames?: string): string {
        if (classNames?.includes('${')) {
            try {
                classNames = _.template(classNames ?? '')(this.row as object ?? {});
            } catch (e) {
                console.warn(e);
            }
        }

        return classNames;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes.row) {
            this.value = this.getCellValue();
            this.updateValue();
        }
        if (changes.column) {
            this.updateOptions();
            this.updateConfig();
            this.value = this.getCellValue();
            this.updateValue();
        }
    }

    public createInjector(injector: Injector = this.injector): Promise<Injector> {
        return Promise.resolve(Injector.create({
            providers: [
                {provide: XM_DYNAMIC_TABLE_ROW, useValue: this.row},
                {provide: XM_DYNAMIC_TABLE_CELL, useValue: this._cell},
            ],
            parent: injector,
        }));
    }

    private isSkeleton(): boolean {
        return this.isLoading && this.isSkeletonLoading;
    }

    private getSelector(value?: O): string {
        return this.isSkeleton() ? this.SKELETON_SELECTOR : value?.selector || this.cell?.selector;
    }

    private getConfig(value?: O): any {
        return this.isSkeleton() ? value?.skeleton || this.cell?.skeleton : value?.config || this.cell?.config;
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
    exports: [XmDynamicCellDirective],
    declarations: [XmDynamicCellDirective],
})
export class XmDynamicCellModule {
}
