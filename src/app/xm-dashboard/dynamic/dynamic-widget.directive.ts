import {
    Directive,
    Injector,
    Input,
    NgModuleRef,
    OnChanges,
    Renderer2,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';
import { DynamicComponentsService } from '@xm-ngx/components/dynamic';
import { CNgModuleFactory } from '@xm-ngx/components/dynamic/dynamic-components-base';
import * as _ from 'lodash';
import { from } from 'rxjs';
import { ExtLoader } from './ext-loader';

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

@Directive({
    selector: 'xm-dynamic-widget, [xm-dynamic-widget]',
    providers: [ExtLoader, DynamicComponentsService],
})
export class DynamicWidgetDirective implements OnChanges {

    @Input() public class: string;
    @Input() public style: string;
    private _layout: WidgetConfig;

    constructor(private injector: Injector,
                private dynamicComponentsService: DynamicComponentsService,
                private extLoader: ExtLoader,
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
            this.loadComponent();
        }
    }

    private loadComponent(): void {
        const value = this._layout;

        // WARNING: Experimental
        if (value.module === '@xm-ngx' || value.selector && value.selector.startsWith('@xm-ngx')) {
            const moduleFac = this.injector.get(this._layout?.config?.name || this._layout.selector);
            this.createLazyComponent(this._layout, moduleFac, this.injector);
            return;
        }

        if (value.selector && value.selector.indexOf('/') > 0) {
            value.module = value.selector.split('/')[0];
            value.selector = value.selector.split('/')[1];
        }

        const moduleFactoryRef = this.dynamicComponentsService.loadTenantModuleFactory(value.module);
        const moduleFactory = from(moduleFactoryRef);

        moduleFactory.subscribe((factory) => {
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
                this.createComponent(value, module, componentTypeOrLazyComponentType);
            }
        });
    }


    private async createLazyComponent<T>(
        value: WidgetConfig,
        lazy: Promise<CNgModuleFactory<any>>,
        injector: Injector,
    ): Promise<void> {
        const moduleFactory = await this.extLoader.loadModuleFactory(lazy);
        const activeModule = moduleFactory.create(injector);
        const entryComponent = activeModule.instance.entry || (moduleFactory.moduleType as any).entry;
        if (!entryComponent) {
            // eslint-disable-next-line no-console
            console.error(`ERROR: the "${value.module}" module expected to have a "entry" filed!`
                + 'E.g. static entry = YourComponent;');
            return;
        }

        this.createComponent(value, activeModule, entryComponent);
    }

    private createComponent<T>(value: WidgetConfig, module: NgModuleRef<T>, entryComponentType: WidgetFn): void {
        const componentFactory = module.componentFactoryResolver.resolveComponentFactory(entryComponentType);
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
