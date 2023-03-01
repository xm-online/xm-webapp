import { CommonModule } from '@angular/common';
import {
    Component,
    forwardRef,
    Input,
    OnInit,
    inject,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';
import { LanguageService, Translate, XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, tap, shareReplay, finalize } from 'rxjs/operators';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { EntityCollectionFactoryService } from '@xm-ngx/components/entity-collection';
import { format } from '@xm-ngx/shared/operators';
import { HttpHeaders } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { coerceArray } from '@angular/flex-layout';

export interface XmAutocompleteControlMapper {
    // Interpolated string as ${name}
    displayFn: string;
    valueByKey: string;
}

export type XmAutocompleteControlParams = Record<string, string>;
export type XmAutocompleteControlBody = Record<string, string>;

export interface XmAutocompleteControlListItem {
    value: string;
    view: string;
}

export interface XmAutocompleteControlConfig {
    hint?: HintText;
    title?: string;
    search: {
        resourceUrl: string;
        resourceMethod: string;
        queryParams: XmAutocompleteControlParams;
        body: XmAutocompleteControlBody;
        headers: Record<string, string>;
    };
    fetchSelectedByCriteria: {
        body: XmAutocompleteControlParams;
        queryParams: XmAutocompleteControlParams;
    };
    multiple: boolean;
    extractByKey?: string;
    itemMapper: XmAutocompleteControlMapper;
    skipFetchSelected: boolean;
    autoSelectFirst: boolean;
    searchPlaceholder?: Translate;
    notFoundSearchPlaceholder?: Translate;
}

const AUTOCOMPLETE_CONTROL_DEFAULT_CONFIG: XmAutocompleteControlConfig = {
    hint: null,
    title: '',
    search: {
        resourceUrl: null,
        resourceMethod: 'GET',
        queryParams: {},
        body: {},
        headers: {},
    },
    fetchSelectedByCriteria: {
        queryParams: {},
        body: {},
    },
    skipFetchSelected: false,
    multiple: false,
    autoSelectFirst: false,
    extractByKey: null,
    itemMapper: {
        displayFn: '${name}',
        valueByKey: '${name}',
    },
    searchPlaceholder: 'global.rest-select-placeholder-noresults',
    notFoundSearchPlaceholder: 'global.rest-select-placeholder-search.simple',
};

@Component({
    standalone: true,
    selector: 'xm-autocomplete-control',
    template: `
        <mat-form-field>
            <mat-label *ngIf="config?.title">{{ config?.title | translate }}</mat-label>

            <mat-select [multiple]="config?.multiple"
                        [disabled]="disabled"
                        [ngModel]="selected"
                        (selectionChange)="change($event.value)">
                
                <mat-option>
                    <ngx-mat-select-search 
                        [clearSearchInput]="false"
                        [formControl]="searchQueryControl"
                        [placeholderLabel]="config.searchPlaceholder | translate"
                        [noEntriesFoundLabel]="config.notFoundSearchPlaceholder | translate"></ngx-mat-select-search>
                </mat-option>

                <mat-progress-bar mode="indeterminate" *ngIf="loading | async"></mat-progress-bar>

                <div class="mat-option" [hidden]="!selected" (click)="deselect()">
                    <mat-icon>close</mat-icon>
                    {{'common-webapp-ext.buttons.cancel' | translate}}
                </div>

                <ng-container *ngIf="(list | async)?.length > 0; then listing"></ng-container>

                <ng-template #listing>
                    <mat-option *ngFor="let s of list | async"
                                [value]="s.value">
                        {{s.view | translate}}
                    </mat-option>
                </ng-template>
            </mat-select>

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        MatProgressBarModule,
        ReactiveFormsModule,
        FormsModule,
        XmTranslationModule,
        MatIconModule,
        CommonModule,
        HintModule,
    ],
    providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => XmAutocompleteControlComponent), multi: true } ],
})
export class XmAutocompleteControlComponent extends NgModelWrapper<object | string> implements OnInit, OnChanges {
    private refreshValue = new BehaviorSubject<object | string>(null);

    private displayFn: _.TemplateExecutor;
    private valueByKey: _.TemplateExecutor;

    private _config: XmAutocompleteControlConfig = AUTOCOMPLETE_CONTROL_DEFAULT_CONFIG;

    @Input()
    public set config(value: XmAutocompleteControlConfig) {
        this._config = _.defaultsDeep(value, AUTOCOMPLETE_CONTROL_DEFAULT_CONFIG) as XmAutocompleteControlConfig;

        const { displayFn, valueByKey } = format<XmAutocompleteControlMapper>(this.config?.itemMapper, this.getLocaleContext());

        this.displayFn = _.template(displayFn);
        this.valueByKey = _.template(valueByKey);
    }
    public get config(): XmAutocompleteControlConfig {
        return this._config;
    }

    private _selected: unknown | unknown[];

    public set selected(value: unknown | unknown[]) {
        this._selected = value;
    }
    public get selected(): unknown | unknown[] {
        return this._selected;
    }

    private collectionFactory = inject(EntityCollectionFactoryService);
    private languageService = inject(LanguageService);

    private fetchSelected: Observable<XmAutocompleteControlListItem[]>;

    public searchQueryControl = new FormControl('');
    public list = of<XmAutocompleteControlListItem[]>([]);

    private _loading = new BehaviorSubject<boolean>(false);
    public get loading(): Observable<boolean> {
        return this._loading.asObservable();
    }

    public ngOnInit(): void {
        const selectedValue = this.refreshValue.pipe(
            switchMap((value) => {
                if (_.isEmpty(value)) {
                    return of([]);
                }

                const normalizeSelectedValues = this.normalizeCollection(value);
                const defaultSelected = of(normalizeSelectedValues);

                if (!this.fetchSelected) {
                    this.fetchSelected = this.config.skipFetchSelected 
                        ? defaultSelected
                        : this.fetchSelectedValues(normalizeSelectedValues).pipe(
                            // When request is failed, use selected value
                            catchError(() => defaultSelected),
                            shareReplay(1),
                        );
                }
                
                return this.fetchSelected;
            }),
            tap((fetchedSelectedValues) => {
                const unwrapSelected = fetchedSelectedValues?.map(({ value }) => value) ?? [];
                const selected = this.config.multiple 
                    ? unwrapSelected 
                    : unwrapSelected?.[0];

                this.change(selected);
            }),
        );

        const searchResult = this.searchQueryControl.valueChanges.pipe(
            startWith<string>(null),
            distinctUntilChanged(),
            debounceTime(300),
            switchMap((searchQuery) => {
                if (_.isEmpty(searchQuery)) {
                    return of([]);
                }

                return this.searchByQuery(searchQuery).pipe(
                    catchError(() => of([])),
                );
            }),
            shareReplay(1),
        );

        this.list = combineLatest([
            selectedValue,
            searchResult,
        ]).pipe(
            map(([fetchedSelectedValues, search]) => {
                return _.differenceWith(fetchedSelectedValues, search, _.isEqual).concat(search);
            }),
            tap((list) => {
                if (this.config?.autoSelectFirst) {
                    this.autoSelectSingle(list);
                }
            }),
            shareReplay(1),
        );
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.value.isFirstChange() || (changes.value.previousValue == null && !_.isEmpty(changes.value.currentValue))) {
            this.refreshValue.next(this.value);
        }
    }

    private searchByQuery(searchQuery: string): Observable<XmAutocompleteControlListItem[]> {
        const { queryParams, body} = this.config?.search || {};

        const httpParams = format<XmAutocompleteControlParams>(queryParams, this.getSearchCriteriaContext(searchQuery));
        const httpBody = format<XmAutocompleteControlBody>(body, this.getSearchCriteriaContext(searchQuery));

        return this.buildRequest(httpParams, httpBody);
    }

    private fetchSelectedValues(values: unknown): Observable<XmAutocompleteControlListItem[]> {
        const { queryParams, body } = this.config?.fetchSelectedByCriteria || {};

        const httpParams = format<XmAutocompleteControlParams>(queryParams, this.getSearchCriteriaContext(values));
        const httpBody = format<XmAutocompleteControlParams>(body, this.getSearchCriteriaContext(values));

        return this.buildRequest(httpParams, httpBody);
    }

    private getSearchCriteriaContext(search: unknown): Record<string, unknown> {
        return { 
            search, ...this.getLocaleContext(),
        };
    }

    private getLocaleContext(): Record<string, string | string[]> {
        const { locale, languages } = this.languageService;

        return {
            locale,
            languages,
        };
    }

    private buildRequest(httpParams: XmAutocompleteControlParams, httpBody: XmAutocompleteControlBody): Observable<XmAutocompleteControlListItem[]> {
        this._loading.next(true);

        const { resourceUrl, resourceMethod, headers } = this.config?.search || {};

        if (resourceUrl) {
            return this.collectionFactory.create(resourceUrl).request(
                resourceMethod,
                httpBody,
                httpParams,
                new HttpHeaders(headers),
            ).pipe(
                map((data) => {
                    if (this.config?.extractByKey) {
                        return _.get(data, this.config?.extractByKey, []);
                    }
                    
                    return data;
                }),
                map(collection => {
                    return this.normalizeCollection(collection);
                }),
                finalize(() => this._loading.next(false)),
            );
        }

        return of([]);
    }

    private normalizeModel(item: object | string): XmAutocompleteControlListItem {
        return {
            value: _.isObject(item) ? this.valueByKey(item) : item,
            view: _.isObject(item) ? this.displayFn(item) : item,
        };
    }

    private normalizeCollection(collection: object | string): XmAutocompleteControlListItem[] {
        return coerceArray(collection).map((item) => this.normalizeModel(item));
    }

    private autoSelectSingle(list: XmAutocompleteControlListItem[]) {
        if (list.length == 1) {
            const [first] = list;

            this.change(first.value);
        }
    }

    public change(value: object | string): void {
        this.selected = value;
        this.value = value;

        this._onChange(value);
        this.valueChange.next(value);
    }

    public deselect(): void {
        this.change(null);
    }
}