import { ComponentRef, Directive, Injector, OnChanges, OnInit, Renderer2, SimpleChanges, ViewContainerRef, } from '@angular/core';
import { setComponentInput } from '../operators/set-component-input';
import { XmDynamicEntryModule } from '../src/interfaces/xm-dynamic-entry-module';
import { XmDynamicConstructor } from '../src/interfaces/xm-dynamic-constructor';
import { XmDynamicComponentRegistry } from '../src/loader/xm-dynamic-component-registry.service';
import { XmDynamicWithConfig, XmDynamicSelector, XmLayoutNode } from '../src/interfaces';


/** Determines input(control) value. */
interface IValue<V> {
    /** Input value. */
    value?: V;
}

/**
 * Determines inputs for the dynamic components.
 * @public
 */
export interface XmDynamicPresentation<V = unknown, C = unknown> extends IValue<V>, XmDynamicWithConfig<C> {
}


export interface XmDynamicPresentationConstructor<V = unknown, C = unknown> extends XmDynamicConstructor<XmDynamicPresentation<V, C>> {
    new(...args: any): XmDynamicPresentation<V, C>;
}

/**
 * The base interface for all dynamic modules
 * @deprecated Will be removed in v5.0.0. Use standalone component instead.
 */
export interface XmDynamicPresentationEntryModule extends XmDynamicEntryModule<XmDynamicPresentation> {
    entry: XmDynamicPresentationConstructor;
}

@Directive()
export class XmDynamicPresentationBase<V, C> implements XmDynamicPresentation<V, C>, XmLayoutNode, OnChanges, OnInit {
    /** Component value */
    public value: V;
    /**
     * @deprecated
     * Component options
     **/
    public options?: C;
    /** Component config */
    public config?: C;
    /** Component selector */
    public selector: XmDynamicPresentationConstructor<V, C> | XmDynamicSelector;
    /** Component reference */
    public compRef: ComponentRef<XmDynamicPresentation<V, C>>;

    public class: string;
    public style: string;

    get instance(): XmDynamicPresentation<V, C> {
        return this.compRef?.instance;
    }

    constructor(public viewContainerRef: ViewContainerRef,
                public injector: Injector,
                protected renderer: Renderer2,
                protected dynamicComponents: XmDynamicComponentRegistry) {
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

        setComponentInput(this.compRef, 'value', this.value);
    }

    protected updateConfig(): void {
        if (!this.instance) {
            return;
        }
        // TODO: Don't set widget config if it's null, because updateOptions method already set config.
        //  When remove updateOptions, remove "if" and assign the "config" directly without if condition.
        if (this.config != null) {
            setComponentInput(this.compRef, 'config', this.config);
        }
    }

    /**
     * @deprecated
     *  Will be removed in v5.0.0.
     */
    protected updateOptions(): void {
        if (!this.instance) {
            return;
        }

        if (this.instance.options) {
            console.warn(`Dynamic widget "options" property was deprecated use "config" instead component=${this.compRef?.componentType?.name}. Will be removed in v5.0.0.`);
        }

        setComponentInput(this.compRef, 'config', this.options);
        // TODO: Deprecated solution. "options" should not exist. Will be removed in v5.0.0.
        setComponentInput(this.compRef, 'options', this.options);
    }

    protected createInjector(injector: Injector = this.injector): Injector {
        return injector;
    }

    protected async createInstance(): Promise<void> {
        if (!this.selector) {
            return;
        }

        const entry = await this.dynamicComponents.find<XmDynamicPresentation<V, C>>(
            this.selector as XmDynamicSelector, this.createInjector());

        this.viewContainerRef.clear();

        this.compRef = this.viewContainerRef.createComponent(entry.componentType, {
            index: 0,
            ngModuleRef: entry.ngModuleRef,
            injector: entry.injector,
        });

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
