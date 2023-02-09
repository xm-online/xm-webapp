import {
    ComponentFactory, ComponentRef,
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
import { XmDynamicWidget } from './xm-dynamic-widget';

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

    private compRef: ComponentRef<XmDynamicWidget>;

    constructor(private injector: Injector,
                private dynamicLoader: DynamicLoader,
                private renderer: Renderer2,
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

        const cfr = await this.dynamicLoader.loadAndResolve<XmDynamicWidget>(this._layout.selector, {injector: this.injector});
        if (cfr) {
            this.createComponent(this._layout, cfr);
            return;
        }
        console.warn(`"${value.selector}" does not exist!`);
    }

    private createComponent<T extends XmDynamicWidget>(value: XmDynamicWidgetConfig, cfr: ComponentFactory<T>): void {
        this.compRef = this.viewRef.createComponent<XmDynamicWidget>(cfr.componentType, {
            index: 0,
            ngModuleRef: cfr['ngModule'],
            injector: this.injector,
        });

        this.compRef.setInput('config', value.config);
        this.compRef.setInput('spec', value.spec);

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
