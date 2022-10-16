import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, Optional, Self, ViewChild } from '@angular/core';
import { UntypedFormControl, NgControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { AriaLabel, DataQa } from '@xm-ngx/shared/interfaces';
import { Translate } from '@xm-ngx/translation';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, share, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { HintText } from '@xm-ngx/components/hint';
import { EntityCollectionFactoryService, QueryParams } from '@xm-ngx/components/entity-collection';
import { uniqBy as _uniqBy, get as _get, template as _template } from 'lodash/fp';
import * as _ from 'lodash';

interface XmArrayItem {
    value: string;
    view: string;
}

export interface XmArrayControlOptions extends DataQa, AriaLabel {
    hint?: HintText;
    title?: Translate;
    placeholder?: Translate;
    removable?: boolean;
    selectable?: boolean;
    onlySuggestSelect?: boolean;
    search?: {
        resourceUrl: string;
        queryParams: QueryParams;
        // Interpolated string as ${name}
        displayFn: string;
        pickKey: string;
    };
    autocomplete: string[] | XmArrayItem[];
}

export const XM_ARRAY_CONTROL_OPTIONS_DEFAULT: XmArrayControlOptions = {
    hint: null,
    title: '',
    placeholder: '',
    dataQa: 'array-control',
    ariaLabel: 'Array Control',
    onlySuggestSelect: false,
    search: {
        resourceUrl: null,
        queryParams: {},
        // Interpolated string as ${name}
        displayFn: '${name}',
        pickKey: 'name',
    },
    autocomplete: [],
};

@Component({
    selector: 'xm-array-control',
    templateUrl: './xm-array-control.component.html',
})
export class XmArrayControlComponent extends NgFormAccessor<string[]> {
    public searchControl: UntypedFormControl = new UntypedFormControl();

    public separatorKeysCodes: number[] = [ENTER, COMMA];

    public filteredItems: Observable<XmArrayItem[]>;
    public compareSelectedItems: Observable<XmArrayItem[]>;

    private _selectedItems = new BehaviorSubject<string[]>([]);

    set selectedItems(items: string[]) {
        this._selectedItems?.next(items);
    }
    get selectedItems(): string[] {
        return this._selectedItems.getValue();
    }

    public presetAutocomplete: XmArrayItem[] = [];

    @ViewChild('input') public input: ElementRef<HTMLInputElement>;
    @ViewChild('auto') public matAutocomplete: MatAutocomplete;

    constructor(
        @Optional() @Self() public ngControl: NgControl,
        private factoryService: EntityCollectionFactoryService,
    ) {
        super(ngControl);
    }

    private _options: XmArrayControlOptions = _.cloneDeep(XM_ARRAY_CONTROL_OPTIONS_DEFAULT);

    public get options(): XmArrayControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmArrayControlOptions) {
        this._options = _.defaultsDeep({}, value, {
            ...XM_ARRAY_CONTROL_OPTIONS_DEFAULT,
        });

        this._options.placeholder = this._options.placeholder || this._options.title;
        this.presetAutocomplete = this.buildItems(this._options.autocomplete);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        const searchQuery = this.searchControl.valueChanges.pipe(startWith<string, null>(null));
        const fetchAutocompleteItems = of(this.presetAutocomplete).pipe(
            switchMap((autocompleteList) => {
                const { resourceUrl, queryParams, displayFn, pickKey } = this.options?.search || {};

                if (resourceUrl) {
                    return this.factoryService.create<unknown>(resourceUrl)
                        .query(queryParams).pipe(
                            map(({ body: items = [] }) => items?.map((item) => {
                                return {
                                    value: _get(pickKey, item),
                                    view: _template(displayFn)(item as object),
                                };
                            })),
                            map(items => [
                                ...this.buildItems(items),
                                ...autocompleteList,
                            ]),
                        );
                }

                return of(autocompleteList);
            }),
            map((items) => _uniqBy('value', items)),
            share(),
        );

        this.filteredItems = fetchAutocompleteItems.pipe(
            switchMap(items => searchQuery.pipe(
                map((search) => ({items, search})),
            )),
            map(({items, search}: any) => {
                if (search?.length > 0) {
                    search = search.toLowerCase();

                    const searchMatch = [
                        new RegExp('^' + search + '.*', 'i'),
                        new RegExp('\\s' + search + '.*', 'i'),
                    ];

                    return items.filter(item => {
                        return searchMatch.some(r => r.test(item.value));
                    });
                }

                return items;
            }),
        );

        this.compareSelectedItems = combineLatest([
            fetchAutocompleteItems,
            this._selectedItems.asObservable(),
        ]).pipe(
            map(([filteredItems, selectedItems]) => {
                if (filteredItems.length > 0) {
                    return filteredItems.filter(({value}) => selectedItems.includes(value));
                }

                return this.buildItems(selectedItems);
            }),
            shareReplay(),
        );

        this.selectedItems = this.control.value || [];
        this.searchControl.validator = this.control.validator;
    }

    public add(event: MatChipInputEvent): void {
        if (this.options.onlySuggestSelect) {
            return;
        }

        const input = event.input;
        const value = (event.value ?? '').trim();

        if (value && this.selectedItems.includes(value)) {
            (this.selectedItems ?? []).push(value);
        }

        if (input) {
            input.value = '';
        }

        this.searchControl.setValue(null);
        this.change(this.selectedItems);
    }

    public remove(item: string): void {
        const selected = this.selectedItems.slice();
        const index = selected.indexOf(item);

        if (index >= 0) {
            selected.splice(index, 1);
        }
        this.selectedItems = selected;
        this.change(this.selectedItems);
    }

    public select(event: MatAutocompleteSelectedEvent): void {
        this.selectedItems = [...this.selectedItems, event.option.value];
        this.input.nativeElement.value = '';
        this.searchControl.setValue(null);
        this.change(this.selectedItems);
    }

    public writeValue(value: string[] | null): void {
        this.selectedItems = value || [];
        super.writeValue(value);
    }

    private buildItems(items: XmArrayItem[] | string[]): XmArrayItem[] {
        return items.map(item => typeof item === 'string' ? { value: item, view: item } : item).slice();
    }
}
