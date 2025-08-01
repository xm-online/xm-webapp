/*
 Copyright 2016-2021 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see https://www.jhipster.tech/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import { Directive, forwardRef, Input } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

@Directive({
    selector: '[jhiMin][ngModel]',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    providers: [{provide: NG_VALIDATORS, useExisting: forwardRef(() => JhiMinValidatorDirective), multi: true}],
    standalone: false,
})
export class JhiMinValidatorDirective {
    @Input() public jhiMin: number;

    constructor() {
    }

    public validate(c: FormControl): ValidationErrors | null {
        return c.value === undefined || c.value === null || c.value >= this.jhiMin
            ? null
            : {
                min: {
                    valid: false,
                },
            };
    }
}
