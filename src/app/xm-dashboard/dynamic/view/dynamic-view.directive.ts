import {
    ComponentFactoryResolver,
    Directive,
    Injector,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';
import { DynamicLoader } from '../loader/dynamic-loader';

export interface IComponent<V, O> {
    value: V;
    options: O;
}

export interface IComponentFn<V, O> {
    new(...args: any): IComponent<V, O>;
}

/**
 * DynamicComponent creates a component from the DynamicLoader
 * @example
 * <ng-template xmDynamicView [selector]="'@xm-ngx/components/xm-bool-view'" [value]="false"></ng-template>
 */
@Directive({
    selector: '[xmDynamicView]',
})
export class DynamicViewDirective<V, O> implements IComponent<V, O>, OnChanges, OnInit {
    /** Component value */
    @Input() public value: V;
    /** Component options */
    @Input() public options: O;
    /** Component ref */
    @Input() public selector: IComponentFn<V, O> | string;
    /** Instance of created object */
    public instance: IComponent<V, O>;

    constructor(public viewContainerRef: ViewContainerRef,
                public injector: Injector,
                protected loaderService: DynamicLoader,
                protected cfr: ComponentFactoryResolver) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.updateValue();
        }
        if (changes.options) {
            this.updateOptions();
        }
        if (changes.selector && !changes.selector.firstChange) {
            this.createComponent().then();
        }
    }

    public ngOnInit(): void {
        this.createComponent().then();
    }

    protected async createComponent(): Promise<void> {
        await this.createInstance();
        this.updateValue();
        this.updateOptions();
    }

    protected updateValue(): void {
        if (!this.instance) {
            return;
        }
        this.instance.value = this.value;
    }

    protected updateOptions(): void {
        if (!this.instance) {
            return;
        }
        this.instance.options = this.options;
    }

    protected async createInstance(): Promise<void> {
        if (!this.selector) {
            return;
        }

        const ref = await this.loaderService.load<IComponent<V, O>>(this.selector as string);
        const cfr = this.cfr.resolveComponentFactory(ref);

        this.viewContainerRef.clear();
        const c = this.viewContainerRef.createComponent(cfr, 0, this.injector);
        this.instance = c.instance;
    }
}
