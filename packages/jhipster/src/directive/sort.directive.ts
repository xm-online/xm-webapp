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
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Directive({
    selector: '[jhiSort]',
    standalone: false,
})
export class JhiSortDirective {
    @Input() public predicate: string;
    @Input() public ascending: boolean;
    @Input() public callback: Function;

    @Output() public predicateChange: EventEmitter<string> = new EventEmitter();
    @Output() public ascendingChange: EventEmitter<boolean> = new EventEmitter();

    public activeIconComponent: FaIconComponent;

    constructor() {
    }

    public sort(field: string): void {
        this.ascending = field !== this.predicate ? true : !this.ascending;
        this.predicate = field;
        this.predicateChange.emit(field);
        this.ascendingChange.emit(this.ascending);
        this.callback();
    }
}
