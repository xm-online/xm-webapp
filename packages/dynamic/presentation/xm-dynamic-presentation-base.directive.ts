import {
    ComponentRef,
    Directive,
    Injector,
    OnChanges,
    OnInit,
    Renderer2,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';
import { XmDynamicServiceFactory, XmDynamicWithSelector } from '@xm-ngx/dynamic';
import {
    XmDynamicInjectionTokenStoreService
} from '@xm-ngx/dynamic/src/services/xm-dynamic-injection-token-store.service';
import { XmConfig } from '@xm-ngx/interfaces';
import { setComponentInput } from '../operators/set-component-input';
import { XmDynamicSelector, XmDynamicWithConfig, XmLayoutNode } from '../src/interfaces';
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
 * @deprecated Will be removed in v6.0.0. Use standalone component instead.
 */
export interface XmDynamicPresentationEntryModule extends XmDynamicEntryModule<XmDynamicPresentation> {
    entry: XmDynamicPresentationConstructor;
}

export interface XmDynamicControllerConfig extends XmDynamicWithConfig, XmDynamicWithSelector {
    key: string,
}

@Directive()
export class XmDynamicPresentationBase<V, C> implements XmDynamicPresentation<V, C>, XmLayoutNode, OnChanges, OnInit {
    public controllers: XmDynamicControllerConfig[] = [];

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
                protected dynamicComponents: XmDynamicComponentRegistry,
                protected dynamicServices: XmDynamicServiceFactory,
                protected dynamicInjectionTokenStore: XmDynamicInjectionTokenStoreService
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
        // TODO: Don't set widget config if it's null, because updateOptions method already set config.
        //  When remove updateOptions, remove "if" and assign the "config" directly without if condition.
        if (this.config != null) {
            setComponentInput(this.compRef, 'config', this.config);
        }
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

        setComponentInput(this.compRef, 'config', this.options);
        // TODO: Deprecated solution. "options" should not exist. Will be removed in v5.0.0.
        setComponentInput(this.compRef, 'options', this.options);
    }

    protected async createInjector(parentInjector: Injector = this.injector): Promise<Injector> {
        // TODO: create DynamicControllerConfig to ControllerEntry method
        const controllersEntries: {
            classType: XmDynamicConstructor,
            config: XmConfig,
            key: string,
        }[] = await Promise.all(this.controllers.map(async controller => ({
            classType: await this.dynamicServices.find(controller.selector, parentInjector),
            config: controller.config,
            key: controller.key,
        })));

        const providers = controllersEntries.map(serviceEntry => {
            const token = this.dynamicInjectionTokenStore.resolve(serviceEntry.key);
            return {provide: token, useClass: serviceEntry.classType, deps: []};
        });

        const injector = Injector.create({
            providers,
            parent: parentInjector,
        });

        controllersEntries.forEach(service => {
            const token = this.dynamicInjectionTokenStore.resolve(service.key);
            const instance = injector.get(token);
            instance.config = service.config;
        });

        return injector;
    }

    protected async createInstance(): Promise<void> {
        if (!this.selector) {
            return;
        }

        const entry = await this.dynamicComponents.find<XmDynamicPresentation<V, C>>(
            this.selector as XmDynamicSelector, await this.createInjector());

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
