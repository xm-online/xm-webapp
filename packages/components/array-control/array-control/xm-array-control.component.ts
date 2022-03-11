import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, Optional, Self, ViewChild } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { AriaLabel, DataQa } from '@xm-ngx/shared/interfaces';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Translate } from '@xm-ngx/translation';
import { clone, defaults } from 'lodash';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HintText } from '@xm-ngx/components/hint';

interface XmArrayItem {
    value: string
}

export interface XmArrayControlOptions extends DataQa, AriaLabel {
    hint?: HintText;
    title?: Translate;
    placeholder?: Translate;
    removable?: boolean;
    selectable?: boolean;
    autocomplete: (string | XmArrayItem)[];
}

export const XM_ARRAY_CONTROL_OPTIONS_DEFAULT: XmArrayControlOptions = {
    hint: null,
    title: '',
    placeholder: '',
    dataQa: 'array-control',
    ariaLabel: 'Array Control',
    autocomplete: [],
};

@Component({
    selector: 'xm-array-control',
    templateUrl: './xm-array-control.component.html',
})
export class XmArrayControlComponent extends NgFormAccessor<string[]> {
    public inputControl: FormControl = new FormControl();

    public filteredAutocomplete: Observable<{ value: string }[]>;
    public autocompleteList: XmArrayItem[];
    @ViewChild('input') public input: ElementRef<HTMLInputElement>;
    @ViewChild('auto') public matAutocomplete: MatAutocomplete;

    public separatorKeysCodes: number[] = [ENTER, COMMA];
    public selected: string[] = [];

    constructor(@Optional() @Self() public ngControl: NgControl) {
        super(ngControl);
        this.filteredAutocomplete = this.inputControl.valueChanges.pipe(
            startWith(null),
            takeUntilOnDestroy(this),
            map((item: string | null) => item ? this.filter(item) : (this.autocompleteList || []).slice()));
    }

    private _options: XmArrayControlOptions = clone(XM_ARRAY_CONTROL_OPTIONS_DEFAULT);

    public get options(): XmArrayControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmArrayControlOptions) {
        this._options = defaults({}, value, {
            ...XM_ARRAY_CONTROL_OPTIONS_DEFAULT,
        });

        this._options.placeholder = this._options.placeholder || this._options.title;

        this.autocompleteList = this._options.autocomplete.map(i => typeof i === 'string' ? { value: i } : i);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.selected = this.control.value || [];
        this.inputControl.validator = this.control.validator;
    }

    public add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            if (!this.selected) {
                this.selected = [];
            }
            this.selected.push(value.trim());
        }

        if (input) {
            input.value = '';
        }

        this.inputControl.setValue(null);
        this.change(this.selected);
    }

    public remove(item: string): void {
        const index = this.selected.indexOf(item);

        if (index >= 0) {
            this.selected.splice(index, 1);
        }
        this.change(this.selected);
    }

    public select(event: MatAutocompleteSelectedEvent): void {
        this.selected.push(event.option.viewValue);
        this.input.nativeElement.value = '';
        this.inputControl.setValue(null);
        this.change(this.selected);
    }

    public writeValue(value: string[]): void {
        this.selected = value;
        super.writeValue(value);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
        super.ngOnDestroy();
    }

    private filter(value: string): XmArrayItem[] {
        const filterValue = value.toLowerCase();
        return this.autocompleteList.filter(i => i.value.toLowerCase().indexOf(filterValue) === 0);
    }
}
