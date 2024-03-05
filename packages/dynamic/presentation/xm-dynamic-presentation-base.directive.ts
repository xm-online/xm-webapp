import {
    ComponentRef,
    Directive,
    inject,
    Injector,
    OnChanges,
    OnInit,
    Renderer2,
    SimpleChanges,
    StaticProvider,
    ViewContainerRef,
} from '@angular/core';
import { XM_DYNAMIC_COMPONENT_CONFIG } from '../src/dynamic.injectors';
import {
    XmDynamicControllerInjectorFactoryService,
} from '../src/services/xm-dynamic-controller-injector-factory.service';
import { setComponentInput } from '../operators/set-component-input';
import { XmDynamicSelector, XmDynamicWithConfig, XmDynamicWithSelector, XmLayoutNode } from '../src/interfaces';
import { XmDynamicConstructor } from '../src/interfaces/xm-dynamic-constructor';
import { XmDynamicEntryModule } from '../src/interfaces/xm-dynamic-entry-module';
import { XmDynamicComponentRegistry } from '../src/loader/xm-dynamic-component-registry.service';


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
 */
export interface XmDynamicPresentationEntryModule extends XmDynamicEntryModule<XmDynamicPresentation> {
    entry: XmDynamicPresentationConstructor;
}

export interface XmDynamicControllerDeclaration extends XmDynamicWithConfig, XmDynamicWithSelector {
    key: string,
}

@Directive()
export class XmDynamicPresentationBase<V, C> implements XmDynamicPresentation<V, C>, XmLayoutNode, OnChanges, OnInit {
    public controllers: XmDynamicControllerDeclaration[] = [];

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

    protected dynamicControllerInjectorFactory = inject(XmDynamicControllerInjectorFactoryService);

    constructor(public viewContainerRef: ViewContainerRef,
                public injector: Injector,
                protected renderer: Renderer2,
                protected dynamicComponents: XmDynamicComponentRegistry
    ) {
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
        setComponentInput(this.compRef, 'config', this.config || this.options);
    }

    /**
     * @deprecated
     *  Will be removed in v6.0.0.
     */
    protected updateOptions(): void {
        if (!this.instance) {
            return;
        }

        if (this.instance.options) {
            console.warn(`Dynamic widget "options" property was deprecated use "config" instead component=${this.compRef?.componentType?.name}. Will be removed in v6.0.0.`);
        }

        // TODO: Deprecated solution. "options" should not exist. Will be removed in v5.0.0.
        setComponentInput(this.compRef, 'options', this.options || this.config);
    }

    protected async createInjector(injector: Injector = this.injector): Promise<Injector> {
        return Promise.resolve(injector);
    }

    protected async createInstance(): Promise<void> {
        if (!this.selector) {
            return;
        }
        const providers = [
            this.configProvider(),
        ];
        const injector = await this.dynamicControllerInjectorFactory.defineProviders(this.controllers, providers, await this.createInjector());

        const entry = await this.dynamicComponents.find<XmDynamicPresentation<V, C>>(
            this.selector as XmDynamicSelector, injector);

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

    private configProvider(): StaticProvider {
        return {
            provide: XM_DYNAMIC_COMPONENT_CONFIG,
            useValue: this.config,
        };
    }
}
