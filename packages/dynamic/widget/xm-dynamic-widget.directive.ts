import {
    ComponentRef,
    Directive,
    inject,
    Injector,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges,
    StaticProvider,
    ViewContainerRef,
} from '@angular/core';
import { NotFoundException } from '@xm-ngx/exceptions';
import { XmConfig } from '@xm-ngx/interfaces';
import * as _ from 'lodash';

import { setComponentInput } from '../operators/set-component-input';
import { XmDynamicControllerDeclaration } from '../presentation/xm-dynamic-presentation-base.directive';
import { XM_DYNAMIC_COMPONENT_CONFIG } from '../src/dynamic.injectors';
import { XmDynamicWithConfig, XmDynamicWithSelector } from '../src/interfaces/xm-dynamic-selector';
import {
    XmDynamicComponentRecord,
    XmDynamicComponentRegistry,
} from '../src/loader/xm-dynamic-component-registry.service';
import {
    XmDynamicControllerInjectorFactoryService,
} from '../src/services/xm-dynamic-controller-injector-factory.service';
import { XmDynamicWidget } from './xm-dynamic-widget';

export interface XmDynamicWidgetConfig<C = XmConfig, S = any> extends XmDynamicWithConfig<C>, XmDynamicWithSelector {
    /** @deprecated use selector instead */
    module?: string;
    /** @deprecated use selector instead */
    component?: string;
    /** @deprecated spec will be removed, you should provide the spec locally */
    spec?: S;
}

@Directive({
    selector: 'xm-dynamic-widget, [xm-dynamic-widget]',
    standalone: false,
})
export class XmDynamicWidgetDirective implements OnChanges {

    @Input() public class: string;
    @Input() public style: string;
    public compRef: ComponentRef<XmDynamicWidget>;
    protected dynamicControllerInjectorFactory = inject(XmDynamicControllerInjectorFactoryService);
    private _layout: XmDynamicWidgetConfig & { controllers?: XmDynamicControllerDeclaration[], injector: Injector };

    constructor(private dynamicComponents: XmDynamicComponentRegistry,
                private renderer: Renderer2,
                private injector: Injector,
                private viewRef: ViewContainerRef) {
    }

    public get init(): XmDynamicWidgetConfig & { controllers?: XmDynamicControllerDeclaration[], injector: Injector } {
        return this._layout;
    }

    @Input()
    public set init(value: XmDynamicWidgetConfig & {
        controllers?: XmDynamicControllerDeclaration[],
        injector: Injector
    }) {
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
        // Join module and component into selector
        if (!value.selector) {
            value.selector = `${value.module}/${value.component}`;
        }

        const configProvider: StaticProvider = {
            provide: XM_DYNAMIC_COMPONENT_CONFIG,
            useValue: value.config,
        };
        const injector = await this.dynamicControllerInjectorFactory.defineProviders(value.controllers ?? [], [configProvider], value.injector || this.injector);
        try {
            const result = await this.dynamicComponents.find<XmDynamicWidget>(this._layout.selector, injector);
            this.createComponent(this._layout, result);
        } catch (err: unknown) {
            if (err instanceof NotFoundException) {
                // eslint-disable-next-line no-console
                console.error(`"The selector=${value.selector}" does not exist!`);
                return;
            }
            // eslint-disable-next-line no-console
            console.error(err); // This log required in case of error in constructor of component
        }
    }

    private createComponent<T extends XmDynamicWidget>(value: XmDynamicWidgetConfig, data: XmDynamicComponentRecord<XmDynamicWidget>): void {
        this.viewRef.clear();
        this.compRef = this.viewRef.createComponent<XmDynamicWidget>(data.componentType, {
            ngModuleRef: data.ngModuleRef,
            injector: data.injector,
        });

        setComponentInput(this.compRef, 'config', value.config);
        setComponentInput(this.compRef, 'spec', value.spec);

        // TODO: pass children layout
        const el = (this.compRef.location.nativeElement as HTMLElement);
        if (this.class) {
            this.renderer.setAttribute(el, 'class', this.class);
        }
        if (this.style) {
            this.renderer.setAttribute(el, 'style', this.style);
        }
    }
}
