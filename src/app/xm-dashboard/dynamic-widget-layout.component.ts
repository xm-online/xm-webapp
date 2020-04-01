import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

interface Layout {
    content?: Layout[];
    selector?: string;
    class?: string;
    style?: string;
}

@Component({
    selector: 'xm-dynamic-widget-layout, [xm-dynamic-widget-layout]',
    template: `
        <ng-template #tagRef let-layout="layout">
            <div [class]="layout.class"
                 [style]="sanitize(layout.style)"
                 xm-dynamic-widget-layout
                 [resolveCustomParams]="resolveCustomParams"
                 [isCustomElement]="isCustomElement"
                 [layouts]="layout.content">
            </div>
        </ng-template>

        <ng-template #dynamicRef let-layout="layout">
            <ng-container xm-dynamic-widget
                          [class]="layout.class"
                          [style]="layout.style"
                          [init]="resolveCustomParams(layout)">
                <ng-container xm-dynamic-widget-layout
                              [resolveCustomParams]="resolveCustomParams"
                              [isCustomElement]="isCustomElement"
                              *ngIf="layout.content"
                              [layouts]="layout.content"></ng-container>
            </ng-container>
        </ng-template>

        <ng-template ngFor [ngForOf]="layouts" let-layout>
            <!-- resolve as html tag or dynamic injector -->
            <ng-container *ngIf="layout"
                          [ngTemplateOutlet]="isCustomElement(layout) ? dynamicRef : tagRef"
                          [ngTemplateOutletContext]="{layout: layout}">
            </ng-container>
        </ng-template>
    `,
})
export class DynamicWidgetLayoutComponent<T extends Layout = Layout> {
    constructor(private sanitizer: DomSanitizer) {
    }

    private _layouts: T[];

    public get layouts(): T[] {
        return this._layouts;
    }

    @Input()
    public set layouts(value: T[]) {
        this._layouts = value;
    }

    public sanitize(unsafeStyle: string): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(unsafeStyle);
    }

    @Input()
    public isCustomElement(layout: T): boolean {
        return layout.selector !== 'div';
    }

    @Input()
    public resolveCustomParams(layout: T): T {
        return layout;
    }
}
