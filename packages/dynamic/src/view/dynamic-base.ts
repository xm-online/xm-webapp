import {
    ComponentFactoryResolver,
    Directive,
    Injector,
    OnChanges,
    OnInit,
    Renderer2,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';
import { DynamicLoader } from '../loader/dynamic-loader';


/** Determines input(control) value. */
interface IValue<V> {
    /** Input value. */
    value: V;
}

/** Determines input(control) options. */
interface IOptions<O> {
    /** Input options. */
    options: O;
}

/**
 * Determines inputs for the dynamic components.
 *
 * @public
 */
export interface IComponent<V = unknown, O = unknown> extends IValue<V>, IOptions<O> {
    /** {@inheritDoc IValue} */
    value: V;
    /** {@inheritDoc IOptions.value} */
    options: O;
}

export interface IComponentFn<V = unknown, O = unknown> {
    new(...args: any): IComponent<V, O>;
}

@Directive()
export class DynamicBase<V, O> implements IComponent<V, O>, OnChanges, OnInit {
    /** Component value */
    public value: V;
    /** Component options */
    public options: O;
    /** Component ref */
    public selector: IComponentFn<V, O> | string;
    /** Instance of created object */
    public instance: IComponent<V, O>;

    public class: string;
    public style: string;

    constructor(public viewContainerRef: ViewContainerRef,
                public injector: Injector,
                protected renderer: Renderer2,
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

    protected createInjector(): Injector {
        return this.injector;
    }

    protected async createInstance(): Promise<void> {
        if (!this.selector) {
            return;
        }

        const cfr = await this.loaderService.loadAndResolve<IComponent<V, O>>(this.selector as string, { injector: this.injector });

        this.viewContainerRef.clear();
        const c = this.viewContainerRef.createComponent(cfr, 0, this.createInjector());
        this.instance = c.instance;

        const el = c.location.nativeElement as HTMLElement;
        this.updateStyles(el);
    }

    protected updateStyles(el: HTMLElement): void {
        if (this.class) {
            this.renderer.setAttribute(el, 'class', this.class);
        }
        if (this.style) {
            this.renderer.setAttribute(el, 'style', this.style);
        }
    }
}
