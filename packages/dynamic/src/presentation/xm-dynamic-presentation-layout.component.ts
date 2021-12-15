import { Component } from '@angular/core';
import { XmLayout } from '../interfaces';
import { XmDynamicLayoutBase } from '../widget/xm-dynamic-layout.base';
import { XmDynamicPresentation } from './xm-dynamic-presentation-base.directive';

export interface XmPresentationLayout<V = unknown, O = unknown> extends XmLayout, XmDynamicPresentation<V, O> {
    content?: XmPresentationLayout[];
}

/**
 * @example
 * ```
 * <xm-dynamic-presentation-layout [layouts]="[{selector: '@xm-ngx/components/xm-bool-view', value: true }]"></xm-dynamic-presentation-layout>
 * ```
 * @experimental
 */
@Component({
    selector: 'xm-dynamic-presentation-layout, [xmDynamicPresentationLayout]',
    template: `
        <ng-template #tagRef let-item="item">
            <div [class]="item.layout.class"
                 [style]="item.layout.style"
                 xmDynamicPresentationLayout
                 [resolveCustomParams]="resolveCustomParams"
                 [isCustomElement]="isCustomElement"
                 [layouts]="item.layout.content">
            </div>
        </ng-template>

        <ng-template #dynamicRef let-item="item">
            <ng-container xmDynamicPresentation
                          [class]="item.layout.class"
                          [style]="item.layout.style"
                          [selector]="item.customParams.selector"
                          [value]="item.customParams.value"
                          [options]="item.customParams.options">
            </ng-container>
        </ng-template>

        <ng-template ngFor [ngForOf]="sanitizedLayouts" let-item>
            <!-- resolve as html tag or dynamic injector -->
            <ng-container *ngIf="item">
                <ng-container
                        *xmCondition="item.layout?.condition; arguments {entity: resolveCustomParams(item.layout)?.value}"
                        [ngTemplateOutlet]="item.isCustomElement ? dynamicRef : tagRef"
                        [ngTemplateOutletContext]="{item: item}">
                </ng-container>
            </ng-container>
        </ng-template>
    `,
})
export class XmDynamicPresentationLayoutComponent extends XmDynamicLayoutBase<XmPresentationLayout> {
}
