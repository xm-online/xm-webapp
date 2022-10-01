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
import { XmDynamic, XmDynamicConstructor, XmDynamicEntryModule } from '../../interfaces';
import { DynamicComponentLoaderService } from '../../loader/dynamic-component-loader.service';


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
export interface XmDynamicPresentation<V = unknown, O = unknown> extends XmDynamic, IValue<V>, IOptions<O> {
    /** {@inheritDoc IValue} */
    value: V;
    /** {@inheritDoc IOptions.value} */
    options: O;
}

export interface XmDynamicPresentationConstructor<V = unknown, O = unknown> extends XmDynamicConstructor<XmDynamicPresentation<V, O>> {
    new(...args: any): XmDynamicPresentation<V, O>;
}

export interface XmDynamicPresentationEntryModule extends XmDynamicEntryModule<XmDynamicPresentation> {
    entry: XmDynamicPresentationConstructor;
}

@Directive()
export class XmDynamicPresentationBase<V, O> implements XmDynamicPresentation<V, O>, OnChanges, OnInit {
    /** Component value */
    public value: V;
    /** Component options */
    public options: O;
    /** Component ref */
    public selector: XmDynamicPresentationConstructor<V, O> | string;
    /** Instance of created object */
    public instance: XmDynamicPresentation<V, O>;

    public class: string;
    public style: string;

    constructor(public viewContainerRef: ViewContainerRef,
                public injector: Injector,
                protected renderer: Renderer2,
                protected loaderService: DynamicComponentLoaderService,
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

    protected createInjector(injector: Injector = this.injector): Injector {
        return injector;
    }

    protected async createInstance(): Promise<void> {
        if (!this.selector) {
            return;
        }

        const cfr = await this.loaderService.get(this.selector as string, this.injector);

        this.viewContainerRef.clear();
        if (cfr) {
            const c: any = this.viewContainerRef.createComponent(cfr.component, {index: 0, injector: this.createInjector(cfr?.injector || cfr.module?.injector || this.injector)});
            this.instance = c.instance;

            const el = c.location.nativeElement as HTMLElement;
            this.updateStyles(el);
        }
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
