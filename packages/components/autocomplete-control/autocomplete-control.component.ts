import { CommonModule } from '@angular/common';
import {
    Component,
    forwardRef,
    Input,
    OnInit,
    inject,
    OnChanges,
    SimpleChanges,
    OnDestroy,
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
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, tap, shareReplay, finalize, filter } from 'rxjs/operators';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { EntityCollectionFactoryService } from '@xm-ngx/components/entity-collection';
import { format, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
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
    filterFetchedData?: boolean;
    multiple: boolean;
    extractByKey?: string;
    itemMapper: XmAutocompleteControlMapper;
    skipUpdateWhileMismatch?: boolean;
    skipFetchSelected?: boolean;
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
    filterFetchedData: false,
    skipFetchSelected: false,
    skipUpdateWhileMismatch: false,
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
export class XmAutocompleteControlComponent extends NgModelWrapper<object | string> implements OnInit, OnDestroy, OnChanges {
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

    private fetchSelectedCache: Observable<XmAutocompleteControlListItem[]>;

    private collectionFactory = inject(EntityCollectionFactoryService);
    private languageService = inject(LanguageService);

    public searchQueryControl = new FormControl('');
    public list = of<XmAutocompleteControlListItem[]>([]);

    private _loading = new BehaviorSubject<boolean>(false);
    public get loading(): Observable<boolean> {
        return this._loading.asObservable();
    }

    public ngOnInit(): void {
        const alreadyFetched = this.fetchedChanges();

        const fetchSelected = this.refreshValue.pipe(
            filter((value) => !_.isEmpty(value)),
            map((value) => this.normalizeCollection(value)),
            switchMap((normalizeSelectedValues) => {
                if (!this.fetchSelectedCache) {
                    this.fetchSelectedCache = this.fetchSelectedValues(normalizeSelectedValues).pipe(
                        tap((fetchedSelectedValues) => {
                            alreadyFetched(normalizeSelectedValues, fetchedSelectedValues);
                        }),
                        shareReplay(1),
                    );
                }

                return this.fetchSelectedCache;
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
            fetchSelected,
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
        this.refreshValue.next(this.value);
    }

    private searchByQuery(searchQuery: string): Observable<XmAutocompleteControlListItem[]> {
        const { queryParams, body} = this.config?.search || {};

        const httpParams = format<XmAutocompleteControlParams>(queryParams, this.getSearchCriteriaContext(searchQuery));
        const httpBody = format<XmAutocompleteControlBody>(body, this.getSearchCriteriaContext(searchQuery));

        return this.buildRequest(httpParams, httpBody);
    }

    private fetchSelectedValues(values: XmAutocompleteControlListItem[]): Observable<XmAutocompleteControlListItem[]> {
        if (this.config.skipFetchSelected) {
            return of(values);
        }

        const { queryParams, body } = this.config?.fetchSelectedByCriteria || {};

        const httpParams = format<XmAutocompleteControlParams>(queryParams, this.getSearchCriteriaContext(values));
        const httpBody = format<XmAutocompleteControlParams>(body, this.getSearchCriteriaContext(values));
        
        return this.buildRequest(httpParams, httpBody).pipe(
            catchError(() => of(values)),
        );
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
        return coerceArray(collection)
            .filter(value => !_.isEmpty(value))
            .map((item) => this.normalizeModel(item));
    }

    private autoSelectSingle(list: XmAutocompleteControlListItem[]) {
        if (list.length == 1) {
            const [first] = list;

            this.change(first.value);
        }
    }

    public fetchedChanges(): (selectedValue: XmAutocompleteControlListItem[], fetchedValue: XmAutocompleteControlListItem[]) => void {
        let hasAlreadyValue = false;
        
        return (selectedValue: XmAutocompleteControlListItem[], fetchedValue: XmAutocompleteControlListItem[]) => {
            if (hasAlreadyValue) {
                return;
            }

            if (fetchedValue > selectedValue && this.config.filterFetchedData) {
                fetchedValue = _.intersectionBy(fetchedValue, selectedValue, 'value');
            }

            hasAlreadyValue = true;

            if (fetchedValue > selectedValue && this.config.skipUpdateWhileMismatch) {
                return;
            }

            const unwrapSelected = fetchedValue?.map(({ value }) => value) ?? [];
            const selected = this.config.multiple 
                ? unwrapSelected 
                : unwrapSelected?.[0];


            this.change(selected);
        };
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

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}