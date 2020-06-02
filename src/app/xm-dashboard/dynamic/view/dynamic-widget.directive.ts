import {
    ComponentFactory,
    Directive,
    Injector,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';
import * as _ from 'lodash';
import { DynamicLoader } from '../loader/dynamic-loader';

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

@Directive({
    selector: 'xm-dynamic-widget, [xm-dynamic-widget]',
})
export class DynamicWidgetDirective implements OnChanges {

    @Input() public class: string;
    @Input() public style: string;
    private _layout: WidgetConfig;

    constructor(private injector: Injector,
                private dynamicLoader: DynamicLoader,
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

        // Join module and component into selector
        if (!value.selector) {
            value.selector = `${value.module}/${value.component}`;
        }

        const componentFactory = await this.dynamicLoader.loadAndResolve(this._layout.selector, {injector: this.injector});
        if (componentFactory) {
            this.createComponent(this._layout, componentFactory);
            return;
        } else {
            console.warn(`"${value.selector}" does not exist!`);
        }
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
