import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Layout } from '../../shared/layout.model';
import { DynamicWidgetLayoutComponent } from './dynamic-widget-layout.component';
import { IComponent } from './dynamic-view.directive';

export interface ViewLayout<V = unknown, O = unknown> extends Layout, IComponent<V, O> {
}

/**
 * @example
 * <xm-dynamic-view-layout [layouts]="[{selector: '@xm-ngx/components/xm-bool-view', value: true }]"></xm-dynamic-view-layout>
 */
@Component({
    selector: 'xm-dynamic-view-layout, [xmDynamicViewLayout]',
    template: `
        <ng-template #tagRef let-item="item">
            <div [class]="item.layout.class"
                 [style]="item.layout.style"
                 xmDynamicViewLayout
                 [resolveCustomParams]="resolveCustomParams"
                 [isCustomElement]="isCustomElement"
                 [layouts]="item.layout.content">
            </div>
        </ng-template>

        <ng-template #dynamicRef let-item="item">
            <ng-container xmDynamicView
                          [class]="item.layout.class"
                          [style]="item.layout.style"
                          [selector]="item.customParams.selector"
                          [value]="item.customParams.value"
                          [options]="item.customParams.options">
            </ng-container>
        </ng-template>

        <ng-template ngFor [ngForOf]="sanitizedLayouts" let-item>
            <!-- resolve as html tag or dynamic injector -->
            <ng-container *ngIf="item"
                          [ngTemplateOutlet]="item.isCustomElement ? dynamicRef : tagRef"
                          [ngTemplateOutletContext]="{item: item}">
            </ng-container>
        </ng-template>
    `,
})
export class DynamicViewLayoutComponent extends DynamicWidgetLayoutComponent implements OnChanges {
    @Input() public layouts: ViewLayout[];

    constructor(sanitizer: DomSanitizer) {
        super(sanitizer);
    }

    @Input()
    public isCustomElement(layout: Layout): boolean {
        return layout.selector !== 'div';
    }

    @Input()
    public resolveCustomParams: (layout: Layout) => Layout = (layout: Layout) => layout;

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }
}
