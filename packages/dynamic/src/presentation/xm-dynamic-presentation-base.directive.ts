import { Directive, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { XmDynamic, XmDynamicConstructor, XmDynamicEntryModule } from '../interfaces';
import { XmDynamicBase } from './xm-dynamic-base';


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
export class XmDynamicPresentationBase<V, O> extends XmDynamicBase<XmDynamicPresentation<V, O>> implements XmDynamicPresentation<V, O>, OnChanges, OnInit {
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
    public selector: string;
    /** Instance of created object */
    public instance: XmDynamicPresentation<V, O>;
    /** Component css class */
    public class: string;
    /** Component css style */
    public style: string;

    public async ngOnChanges(changes: SimpleChanges): Promise<void> {
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
        await super.ngOnChanges(changes);
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
    }

    protected updateConfig(): void {
        if (!this.instance) {
            return;
        }
        // Don't set widget config if it's null, because updateOptions method already set config
        if (this.config != null) {
            this.instance.config = this.config;
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
        console.warn('Dynamic widget "options" property was deprecated use "config" instead. Make sure that your widget works');
        this.instance.config = this.options;
        // Field options should be removed soon
        this.instance.options = this.options;
    }

    protected async createInstance(): Promise<void> {
        const c = await this.createComponentRef();
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
