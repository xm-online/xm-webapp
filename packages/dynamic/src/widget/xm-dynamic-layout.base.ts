import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { XmLayout, XmSanitizedLayout } from '../interfaces';
import * as _ from 'lodash';

@Directive()
export class XmDynamicLayoutBase<T extends XmLayout = XmLayout> implements OnChanges {

    public sanitizedLayouts: XmSanitizedLayout[];

    @Input() public layouts: T[];

    @Input()
    public isCustomElement(layout: T): boolean {
        return layout.selector !== 'div';
    }

    @Input()
    public resolveCustomParams(layout: T): T {
        return layout;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.layouts || changes.isCustomElement || changes.resolveCustomParams) {
            this.sanitizeLayouts();
        }
    }

    protected sanitizeLayoutNode(node: T): XmSanitizedLayout {
        const obj: XmSanitizedLayout = {
            layout: node,
            isCustomElement: this.isCustomElement(node),
            customParams: node,
        };
        if (obj.isCustomElement) {
            obj.customParams = this.resolveCustomParams(node);
        }
        return obj;
    }

    protected sanitizeLayouts(): void {
        this.sanitizedLayouts = _.map(this.layouts, (i) => this.sanitizeLayoutNode(i));
    }

}
