import { Directive, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NgModelWrapper } from './ng-model-wrapper';

@Directive()
/**
 * Extends NgModelWrapper and attaches self to the NgControl
 * @public
 */
export class NgControlAccessor<T> extends NgModelWrapper<T> {
    constructor(@Optional() @Self() public ngControl: NgControl) {
        super();
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }
}
