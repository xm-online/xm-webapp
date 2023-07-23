import { Component } from '@angular/core';
import { XmDynamicLayout } from '../src/interfaces';
import { XmDynamicLayoutBase } from '../widget/xm-dynamic-layout.base';
import { XmDynamicPresentation } from './xm-dynamic-presentation-base.directive';
import { XmConfig } from '@xm-ngx/interfaces';

export interface XmDynamicPresentationLayout<V = unknown, C = XmConfig> extends XmDynamicLayout<C>, XmDynamicPresentation<V, C> {
    content?: XmDynamicPresentationLayout[];
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
                          [config]="item.customParams.config || item.customParams.options"
            >
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
export class XmDynamicPresentationLayoutComponent extends XmDynamicLayoutBase<XmDynamicPresentationLayout> {
}
