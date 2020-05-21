import {
    ComponentFactory,
    Directive,
    Injector,
    Input,
    NgModuleFactory,
    NgModuleFactoryLoader,
    OnChanges,
    Renderer2,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';
import * as _ from 'lodash';
import { DynamicLoaderService } from './dynamic-loader.service';
import { DynamicTenantLoaderService } from './dynamic-tenant-loader.service';

export interface IWidget<C = any, S = any> {
    config?: C;
    /** @deprecated spec will be removed, you should provide the spec locally */
    spec?: S;
}

export interface WidgetFn {
    new(...args: any): IWidget;
}

export interface WidgetConfig<C = any, S = any> extends IWidget<C, S> {
    selector: string;
    /** @deprecated use selector instead */
    module: string;
    /** @deprecated use selector instead */
    component: string;
    config?: C;
    /** @deprecated spec will be removed, you should provide the spec locally */
    spec?: S;
}

export const ELEMENT_NOT_FOUND = 'ELEMENT_NOT_FOUND';

export type LazyComponent = NgModuleFactory<any>;

@Directive({
    selector: 'xm-dynamic-widget, [xm-dynamic-widget]',
})
export class DynamicWidgetDirective implements OnChanges {

    @Input() public class: string;
    @Input() public style: string;
    private _layout: WidgetConfig;

    constructor(private loader: NgModuleFactoryLoader,
                private injector: Injector,
                private dynamicLoaderService: DynamicLoaderService,
                private dynamicTenantLoaderService: DynamicTenantLoaderService,
                private renderer: Renderer2,
                private viewRef: ViewContainerRef) {
    }

    public get init(): WidgetConfig {
        return this._layout;
    }

    @Input()
    public set init(value: WidgetConfig) {
        if (!value) {
            return;
        }

        this._layout = value;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.init && !_.isEqual(changes.init.currentValue, changes.init.previousValue)) {
            this.loadComponent().then();
        }
    }

    private async loadComponent(): Promise<void> {
        const value = this._layout;

        // WARNING: Experimental
        if (value.module === '@xm-ngx' || value.selector && value.selector.startsWith('@xm-ngx')) {
            const componentFactory = await this.dynamicLoaderService.loadAndResolve(this._layout?.config?.name || this._layout.selector, this.injector);
            this.createComponent(this._layout, componentFactory);
            return;
        }

        if (value.selector && value.selector.indexOf('/') > 0) {
            value.module = value.selector.split('/')[0];
            value.selector = value.selector.split('/')[1];
        }

        const modulePath = this.dynamicTenantLoaderService.resolveTenantModulePath(value.module);
        const factory = await this.loader.load(modulePath);

        const module = factory.create(this.injector);
        const componentTypeOrLazyComponentType = module.injector.get(value.selector || value.component, ELEMENT_NOT_FOUND);

        if (componentTypeOrLazyComponentType === ELEMENT_NOT_FOUND) {
            // eslint-disable-next-line no-console
            console.error(`ERROR: The "${value.component}" does not exist in the "${value.module}" module!`);
            return;
        }

        if (componentTypeOrLazyComponentType instanceof Promise) {
            this.createLazyComponent(value, componentTypeOrLazyComponentType, module.injector);
        } else {
            const componentFactory = module.componentFactoryResolver.resolveComponentFactory(componentTypeOrLazyComponentType);
            this.createComponent(value, componentFactory);
        }
    }

    private async createLazyComponent<T>(
        value: WidgetConfig,
        lazy: Promise<LazyComponent>,
        injector: Injector,
    ): Promise<void> {
        const moduleFactory = await this.dynamicLoaderService.loadModuleFactory<T>(lazy);
        const activeModule = moduleFactory.create(injector);
        const entryComponent = (moduleFactory.moduleType as any).entry || activeModule.instance.entry;

        if (!entryComponent) {
            // eslint-disable-next-line no-console
            console.error(`ERROR: the "${value.module}" module expected to have a "entry" filed!`
                + 'E.g. entry = YourComponent;');
            return;
        }

        const componentFactory = activeModule.componentFactoryResolver.resolveComponentFactory(entryComponent);
        this.createComponent(value, componentFactory);
    }

    private createComponent<T>(value: WidgetConfig, componentFactory: ComponentFactory<T>): void {
        const widget = this.viewRef.createComponent<IWidget>(componentFactory);
        widget.instance.config = value.config;
        widget.instance.spec = value.spec;
        // TODO: pass children layout

        const el = (widget.location.nativeElement as HTMLElement);
        if (this.class) {
            this.renderer.setAttribute(el, 'class', this.class);
        }
        if (this.style) {
            this.renderer.setAttribute(el, 'style', this.style);
        }
    }
}
