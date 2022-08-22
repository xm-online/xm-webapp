import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, Optional, Self, ViewChild } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { AriaLabel, DataQa } from '@xm-ngx/shared/interfaces';
import { Translate } from '@xm-ngx/translation';
import { clone, defaults } from 'lodash';
import { Observable, of } from 'rxjs';
import { map, startWith, switchMap, withLatestFrom } from 'rxjs/operators';
import { HintText } from '@xm-ngx/components/hint';
import { EntityCollectionFactoryService, QueryParams } from '@xm-ngx/components/entity-collection';
import { uniqBy as _uniqBy, get as _get } from 'lodash/fp';

interface XmArrayItem {
    value: string
}

export interface XmArrayControlOptions extends DataQa, AriaLabel {
    hint?: HintText;
    title?: Translate;
    placeholder?: Translate;
    removable?: boolean;
    selectable?: boolean;
    search?: {
        resourceUrl: string;
        queryParams: QueryParams;
        pickKey: string;
    }
    autocomplete: string[] | XmArrayItem[];
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
    public searchControl: FormControl = new FormControl();

    public separatorKeysCodes: number[] = [ENTER, COMMA];

    public filteredItems: Observable<{ value: string }[]>;
    public selectedItems: string[] = [];

    public presetAutocomplete: XmArrayItem[] = [];

    @ViewChild('input') public input: ElementRef<HTMLInputElement>;
    @ViewChild('auto') public matAutocomplete: MatAutocomplete;

    constructor(
        @Optional() @Self() public ngControl: NgControl,
        private factoryService: EntityCollectionFactoryService,
    ) {
        super(ngControl);
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
        this.presetAutocomplete = this.buildItems(this._options.autocomplete);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.filteredItems = this.searchControl.valueChanges.pipe(startWith<string, null>(null)).pipe(
            withLatestFrom(of(this.presetAutocomplete).pipe(
                switchMap((autocompleteList) => {
                    const { resourceUrl = null, queryParams = {}, pickKey = 'name' } = this.options.search;

                    if (resourceUrl) {
                        return this.factoryService.create<unknown>(resourceUrl)
                            .query(queryParams).pipe(
                                map(({ body: items = [] }) => items?.map(item => _get(pickKey, item))),
                                map(items => [
                                    ...this.buildItems(items),
                                    ...autocompleteList,
                                ]),
                            );
                    }

                    return of(autocompleteList);
                }),
            )),
            map(([search, items]) => {
                items = _uniqBy('value', items);

                if (search?.length > 0) {
                    return items.filter(i => i.value.toLowerCase().indexOf(search.toLowerCase()) === 0);
                }

                return items;
            }),
        );

        this.selectedItems = this.control.value || [];
        this.searchControl.validator = this.control.validator;
    }

    public add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            if (!this.selectedItems) {
                this.selectedItems = [];
            }
            this.selectedItems.push(value.trim());
        }

        if (input) {
            input.value = '';
        }

        this.searchControl.setValue(null);
        this.change(this.selectedItems);
    }

    public remove(item: string): void {
        const index = this.selectedItems.indexOf(item);

        if (index >= 0) {
            this.selectedItems.splice(index, 1);
        }
        this.change(this.selectedItems);
    }

    public select(event: MatAutocompleteSelectedEvent): void {
        this.selectedItems.push(event.option.viewValue);
        this.input.nativeElement.value = '';
        this.searchControl.setValue(null);
        this.change(this.selectedItems);
    }

    public writeValue(value: string[] | null): void {
        this.selectedItems = value || [];
        super.writeValue(value);
    }

    private buildItems(items: XmArrayItem[] | string[]): XmArrayItem[] {
        return items.map(item => typeof item === 'string' ? { value: item } : item).slice();
    }
}
