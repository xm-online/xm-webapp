import {
    ComponentFactoryResolver,
    Directive,
    DoCheck,
    InjectionToken,
    Injector,
    Input,
    NgModule,
    OnInit,
    Type,
    ViewContainerRef,
} from '@angular/core';
import * as _ from 'lodash';
import { DynamicTenantLoaderService } from './dynamic-tenant-loader.service';

export const TABLE_ROW = new InjectionToken<string>('TABLE_ROW');
export const TABLE_COLUMN = new InjectionToken<string>('TABLE_COLUMN');

export interface Column {
    field: string;
    selector: string;
}

export interface Component {
    value: unknown;
    options: unknown;
}

@Directive({
    selector: 'xm-dynamic-cell, [xmDynamicCell]',
})
export class DynamicCellComponent<T> implements OnInit, DoCheck {

    @Input() public column: Column;
    @Input() public row: T;

    private _prevValue: unknown;

    constructor(protected viewContainerRef: ViewContainerRef,
                protected injector: Injector,
                protected loaderService: DynamicTenantLoaderService,
                protected cfr: ComponentFactoryResolver) {
    }

    public ngOnInit(): void {
        this.ngDoCheck();
    }

    public async load(): Promise<void> {
        this.viewContainerRef.clear();
        const ref: Type<Component> = await this.loaderService.load<Component>(this.column.selector);

        if (!ref) {
            console.warn(`${this.column.selector} not exist!`);
            return;
        }

        const cfr = this.cfr.resolveComponentFactory(ref);
        const c = this.viewContainerRef.createComponent(cfr, 0, this.createInjector());
        c.instance.value = this._prevValue;
        c.instance.options = this.column;
    }

    public getCellValue(): string | any {
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
        if (this._prevValue !== this.getCellValue()) {
            this._prevValue = this.getCellValue();
            this.ngOnInit();
        }
    }

}

@NgModule({
    imports: [],
    exports: [DynamicCellComponent],
    declarations: [DynamicCellComponent],
    providers: [],
})
export class DynamicCellModule {
}
