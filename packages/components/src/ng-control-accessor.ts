import { Directive, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NgModelWrapper } from '@xm-ngx/components/ng-model-wrapper';

@Directive()
export class NgControlAccessor<T> extends NgModelWrapper<T> {
    constructor(@Self() public ngControl: NgControl) {
        super();
        this.ngControl.valueAccessor = this;
    }
}
