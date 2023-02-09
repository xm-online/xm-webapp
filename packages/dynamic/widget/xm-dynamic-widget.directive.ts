import { Directive, Injector, Input, OnChanges, Renderer2, SimpleChanges, ViewContainerRef, } from '@angular/core';
import * as _ from 'lodash';
import { XmDynamicWidget } from './xm-dynamic-widget';
import {
    XmDynamicComponentRecord,
    XmDynamicComponentRegistry,
} from '../src/loader/xm-dynamic-component-registry.service';

export interface XmDynamicWidgetConfig<C = any, S = any> extends XmDynamicWidget {
    selector: string;
    /** @deprecated use selector instead */
    module: string;
    /** @deprecated use selector instead */
    component: string;
    config: C;
    /** @deprecated spec will be removed, you should provide the spec locally */
    spec?: S;
}

@Directive({
    selector: 'xm-dynamic-widget, [xm-dynamic-widget]',
})
export class XmDynamicWidgetDirective implements OnChanges {

    @Input() public class: string;
    @Input() public style: string;
    private _layout: XmDynamicWidgetConfig;

    constructor(private dynamicComponents: XmDynamicComponentRegistry,
                private renderer: Renderer2,
                private injector: Injector,
                private viewRef: ViewContainerRef) {
    }

    public get init(): XmDynamicWidgetConfig {
        return this._layout;
    }

    @Input()
    public set init(value: XmDynamicWidgetConfig) {
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

        try {
            const result = await this.dynamicComponents.find<XmDynamicWidget>(this._layout.selector, this.injector);
            this.createComponent(this._layout, result);
        } catch (err: unknown) {
            // eslint-disable-next-line no-console
            console.error(`"The selector=${value.selector}" does not exist!`);
        }
    }

    private createComponent<T extends XmDynamicWidget>(value: XmDynamicWidgetConfig, data: XmDynamicComponentRecord<XmDynamicWidget>): void {
        const widget = this.viewRef.createComponent<XmDynamicWidget>(data.componentType, {
            ngModuleRef: data.ngModuleRef,
            injector: data.injector,
        });
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
