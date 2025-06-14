import { Component } from '@angular/core';
import { XmDynamicLayout } from '../src/interfaces';
import { XmDynamicLayoutBase } from './xm-dynamic-layout.base';

@Component({
    selector: 'xm-dynamic-widget-layout, [xm-dynamic-widget-layout]',
    template: `
        <ng-template #tagRef let-item="item">
            <div [class]="item.layout.class"
                 [style]="item.layout.style"
                 xm-dynamic-widget-layout
                 [resolveCustomParams]="resolveCustomParams"
                 [isCustomElement]="isCustomElement"
                 [layouts]="item.layout.content">
            </div>
        </ng-template>

        <ng-template #dynamicRef let-item="item">
            <ng-template [xmPermission]="item?.customParams?.permission"
                         [strategy]="item?.customParams?.permissionStrategy">
                <ng-container
                        xm-dynamic-widget
                        [class]="item.layout.class"
                        [style]="item.layout.style"
                        [init]="item.customParams">
                </ng-container>
            </ng-template>
        </ng-template>

        <ng-template ngFor [ngForOf]="sanitizedLayouts" let-item>
            <!-- resolve as html tag or dynamic injector -->
            <ng-container *ngIf="item"
                          [ngTemplateOutlet]="item.isCustomElement ? dynamicRef : tagRef"
                          [ngTemplateOutletContext]="{item: item}">
            </ng-container>
        </ng-template>
    `,
    standalone: false,
})
export class XmDynamicWidgetLayoutComponent extends XmDynamicLayoutBase<XmDynamicWidgetLayout> {
}

export interface XmDynamicWidgetLayout extends XmDynamicLayout {
}
