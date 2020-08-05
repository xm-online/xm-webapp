import { Directive, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NgModelWrapper } from '@xm-ngx/components/ng-model-wrapper';

@Directive()
export class NgControlAccessor<T> extends NgModelWrapper<T> {
    constructor(@Optional() @Self() public ngControl: NgControl | null) {
        super();
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }
}
