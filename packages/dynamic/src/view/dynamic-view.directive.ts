import { Directive, Input, OnChanges, OnInit } from '@angular/core';
import { DynamicBase, IComponent, IComponentFn } from './dynamic-base';

/**
 * DynamicComponent creates a component from the DynamicLoader
 * @example
 * ```
 * <ng-template xmDynamicView [selector]="'@xm-ngx/components/xm-bool-view'" [value]="false"></ng-template>
 * ```
 */
@Directive({
    selector: '[xmDynamicView]',
})
export class DynamicViewDirective<V, O> extends DynamicBase<V, O> implements IComponent<V, O>, OnChanges, OnInit {
    /** Component value */
    @Input() public value: V;
    /** Component options */
    @Input() public options: O;
    /** Component ref */
    @Input() public selector: IComponentFn<V, O> | string;
    /** Instance of created object */
    public instance: IComponent<V, O>;

    @Input() public class: string;
    @Input() public style: string;
}
