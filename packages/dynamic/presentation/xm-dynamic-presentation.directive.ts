import { Directive, Input, OnChanges, OnInit } from '@angular/core';
import {
    XmDynamicControllerInjectorFactoryService
} from '../src/services/xm-dynamic-controller-injector-factory.service';
import { XmDynamicSelector } from '../src/interfaces';
import {
    XmDynamicControllerDeclaration,
    XmDynamicPresentation,
    XmDynamicPresentationBase,
    XmDynamicPresentationConstructor
} from './xm-dynamic-presentation-base.directive';

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
    providers: [XmDynamicControllerInjectorFactoryService]
})
export class XmDynamicPresentationDirective<V, O> extends XmDynamicPresentationBase<V, O> implements XmDynamicPresentation<V, O>, OnChanges, OnInit {
    @Input() public controllers: XmDynamicControllerDeclaration[] = [];
    /** Component value */
    @Input() public value: V;
    /**
     * @deprecated
     * Component options
     **/
    @Input() public options: O;
    /** Component config */
    @Input() public config: O;
    /** Component ref */
    @Input() public selector: XmDynamicPresentationConstructor<V, O> | XmDynamicSelector;

    @Input() public class: string;
    @Input() public style: string;
}
