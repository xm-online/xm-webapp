import { Directive, Input, OnChanges, OnInit } from '@angular/core';
import { XmDynamicPresentationBase, XmDynamicPresentation, XmDynamicPresentationConstructor } from './xm-dynamic-presentation-base.directive';
import { XmDynamicSelector } from '../src/interfaces';

/**
 * DynamicComponent creates a component from the DynamicLoader
 * @example
 * ```
 * <ng-template xmDynamicPresentation [selector]="'@xm-ngx/components/xm-bool-view'" [value]="false"></ng-template>
 * ```
 * @beta
 */
@Directive({
    selector: '[xmDynamicPresentation]',
})
export class XmDynamicPresentationDirective<V, O> extends XmDynamicPresentationBase<V, O> implements XmDynamicPresentation<V, O>, OnChanges, OnInit {
    /** Component value */
    @Input() public value: V;
    /** Component config */
    @Input() public config: O;
    /** Component ref */
    @Input() public selector: XmDynamicPresentationConstructor<V, O> | XmDynamicSelector;

    @Input() public class: string;
    @Input() public style: string;
}
