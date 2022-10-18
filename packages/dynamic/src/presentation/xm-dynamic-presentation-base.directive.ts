import {
    ComponentFactoryResolver, ComponentRef,
    Directive,
    Injector,
    OnChanges,
    OnInit,
    Renderer2,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';
import { XmDynamic, XmDynamicConstructor, XmDynamicEntryModule } from '../interfaces';
import { DynamicLoader } from '../loader/dynamic-loader';


/** Determines input(control) value. */
interface IValue<V> {
    /** Input value. */
    value: V;
}

/**
 * @deprecated
 * Determines input(control) options.
 **/
interface IOptions<O> {
    /**
     * @deprecated
     * Input options.
     **/
    options?: O;
}

/** Determines input(control) config. */
interface XmDynamicConfig<O> {
    /** Input config. */
    config?: O;
}

/**
 * Determines inputs for the dynamic components.
 *
 * @public
 */
export interface XmDynamicPresentation<V = unknown, O = unknown> extends XmDynamic, IValue<V>, IOptions<O>, XmDynamicConfig<O> {
    /** {@inheritDoc IValue} */
    value: V;
    /**
     * @deprecated
     * This field will deprecated
     **/
    options?: O;
    /** {@inheritDoc IConfig.value} */
    config?: O;
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
    /**
     * @deprecated
     * Component options
     **/
    public options: O;
    /** Component config */
    public config?: O;
    /** Component ref */
    public selector: XmDynamicPresentationConstructor<V, O> | string;
    /** Instance of created object */
    public instance: XmDynamicPresentation<V, O>;
    /** Component ref */
    public compRef: ComponentRef<XmDynamicPresentation<V, O>>;

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
        if (changes.config) {
            this.updateConfig();
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
        this.updateConfig();
    }

    protected updateValue(): void {
        if (!this.instance) {
            return;
        }

        this.instance.value = this.value;

        /**
         * Since v14 you can use the corresponding method for set inputs
         */
        this.compRef.setInput('value', this.value);
    }

    protected updateConfig(): void {
        if (!this.instance) {
            return;
        }
        // Don't set widget config if it's null, because updateOptions method already set config
        if (this.config != null) {
            this.instance.config = this.config;

            /**
             * Since v14 you can use the corresponding method for set inputs
             */
            this.compRef.setInput('config', this.config);
        }
    }

    /**
     * @deprecated
     * This method will deprecate
     */
    protected updateOptions(): void {
        if (!this.instance) {
            return;
        }

        console.warn(`Dynamic widget ${this.selector} "options" property was deprecated use "config" instead. Make sure that your widget works`);

        /**
         * Since v14 you can use the corresponding method for set inputs
         */
        this.instance.config = this.options;
        this.compRef.setInput('config', this.config);

        /**
         * @deprecated
         *
         * Use "config" instead of options
         */
        this.instance.options = this.options;
        this.compRef.setInput('options', this.options);
    }

    protected createInjector(): Injector {
        return this.injector;
    }

    protected async createInstance(): Promise<void> {
        if (!this.selector) {
            return;
        }

        const cfr = await this.loaderService.loadAndResolve<XmDynamicPresentation<V, O>>(this.selector as string, { injector: this.injector });

        this.viewContainerRef.clear();
        this.compRef = this.viewContainerRef.createComponent(cfr.componentType, {
            index: 0,
            injector: this.createInjector(),
        });
        this.instance = this.compRef.instance;

        const el = this.compRef.location.nativeElement as HTMLElement;
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
