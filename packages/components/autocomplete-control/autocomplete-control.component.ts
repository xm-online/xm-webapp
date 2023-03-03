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
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, tap, finalize } from 'rxjs/operators';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { EntityCollectionFactoryService } from '@xm-ngx/components/entity-collection';
import { format, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { HttpHeaders } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { coerceArray } from '@angular/flex-layout';
import { MatOption } from '@angular/material/core';

export interface XmAutocompleteControlMapper {
    // Interpolated string as ${name}
    displayFn: string;
    valueByKey: string;
}

export type XmAutocompleteControlParams = Record<string, string>;
export type XmAutocompleteControlBody = Record<string, string>;

export interface XmAutocompleteControlListItem {
    value: unknown;
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
    compareMap: Record<string, unknown>;
    itemMapper: XmAutocompleteControlMapper;
    skipUpdateWhileMismatch?: boolean;
    skipFetchSelected?: boolean;
    valueAsJson?: boolean;
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
    valueAsJson: false,
    autoSelectFirst: false,
    extractByKey: null,
    compareMap: null,
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
                        [compareWith]="optionCompare"
                        (selectionChange)="change($event.value)">

                <mat-option>
                    <ngx-mat-select-search 
                        [clearSearchInput]="false"
                        [formControl]="searchQueryControl"
                        [placeholderLabel]="config.searchPlaceholder | translate"
                        [noEntriesFoundLabel]="config.notFoundSearchPlaceholder | translate"></ngx-mat-select-search>
                </mat-option>

                <mat-progress-bar mode="indeterminate" *ngIf="loading | async"></mat-progress-bar>

                <div class="mat-mdc-option" [hidden]="!selected" (click)="deselect()">
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
    private refreshValue = new Subject<unknown>();

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

    private requestCache: Observable<XmAutocompleteControlListItem[]>;

    private collectionFactory = inject(EntityCollectionFactoryService);
    private languageService = inject(LanguageService);

    public searchQueryControl = new FormControl('');

    private fetchedList = new BehaviorSubject<XmAutocompleteControlListItem[]>([]);
    private searchedList = new BehaviorSubject<XmAutocompleteControlListItem[]>([]);

    public list = new BehaviorSubject<XmAutocompleteControlListItem[]>([]);

    private _loading = new BehaviorSubject<boolean>(false);
    public get loading(): Observable<boolean> {
        return this._loading.asObservable();
    }

    public ngOnInit(): void {
        this.refreshValue.pipe(
            startWith(null),
            switchMap((value) => {
                if (_.isEmpty(value)) {
                    return of([]);
                }

                const normalizeSelectedValues = this.normalizeCollection(value);

                if (!this.requestCache) {
                    this.requestCache = this.fetchSelectedValues(normalizeSelectedValues).pipe(
                        tap((fetchedSelectedValues) => {
                        // If we received more data than requested, trying filter them
                            if (fetchedSelectedValues > normalizeSelectedValues && this.config.filterFetchedData) {
                                fetchedSelectedValues = _.intersectionBy(fetchedSelectedValues, normalizeSelectedValues, 'value');
                            }
                        
                            if (fetchedSelectedValues > normalizeSelectedValues && this.config.skipUpdateWhileMismatch) {
                                return;
                            }
            
                            this.change(this.unwrapValues(fetchedSelectedValues));
                        }),
                    );
                }

                return this.requestCache;
            }),
            tap(values => {
                this.fetchedList.next(values);
            }),
            takeUntilOnDestroy(this),
        ).subscribe();

        this.searchQueryControl.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(300),
            switchMap((searchQuery) => {
                return this.searchByQuery(searchQuery).pipe(
                    catchError(() => of([])),
                );
            }),
            tap(values => {
                this.searchedList.next(values);
            }),
            takeUntilOnDestroy(this),
        ).subscribe();

        combineLatest([
            this.fetchedList,
            this.searchedList,
        ]).pipe(
            map(([fetchedSelectedValues, search]) => {
                return _.differenceWith(fetchedSelectedValues, search, _.isEqual).concat(search);
            }),
            tap((values) => {
                this.list.next(values);
            }),
            takeUntilOnDestroy(this),
        ).subscribe();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.value.previousValue == null && changes.value.currentValue == null && changes.value.isFirstChange()) {
            this.refreshValue.next(changes.value.currentValue);
        }

        if (this.list.value.length <= 0 && changes.value.previousValue == null 
            && !_.isEmpty(changes.value.currentValue) 
            && !changes.value.isFirstChange()
        ) {            
            this.refreshValue.next(changes.value.currentValue);
        }
    }

    private searchByQuery(searchQuery: string): Observable<XmAutocompleteControlListItem[]> {
        const { queryParams, body} = this.config?.search || {};

        const httpParams = this.format(queryParams, this.getSearchCriteriaContext(searchQuery));
        const httpBody = this.format(body, this.getSearchCriteriaContext(searchQuery));

        return this.buildRequest(httpParams, httpBody);
    }

    private fetchSelectedValues(values: XmAutocompleteControlListItem[]): Observable<XmAutocompleteControlListItem[]> {
        if (this.config.skipFetchSelected) {
            return of(values);
        }

        const { queryParams, body } = this.config?.fetchSelectedByCriteria || {};

        const httpParams = this.format(queryParams, this.getSearchCriteriaContext(values));
        const httpBody = this.format(body, this.getSearchCriteriaContext(values));
        
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

    private format(params: XmAutocompleteControlParams, context: unknown): XmAutocompleteControlParams {
        return _.omitBy(format<XmAutocompleteControlParams>(params, context), _.isEmpty);
    }

    private normalizeModel(item: object | string): XmAutocompleteControlListItem {
        let value = item;
        
        if (_.isObject(item)) {
            const compiled = this.valueByKey(item);

            if (this.config.valueAsJson) {
                try {
                    value = JSON.parse(compiled);
                } catch (error) {}
            } else {
                value = compiled;
            }
        }

        return {
            value,
            view: _.isObject(item) ? this.displayFn(item) : item,
        };
    }

    private normalizeCollection(collection: unknown): XmAutocompleteControlListItem[] {
        return coerceArray(collection)
            .filter(value => !_.isEmpty(value))
            .map((item) => this.normalizeModel(item as object));
    }

    private unwrapValues(list: XmAutocompleteControlListItem[]): unknown | unknown[] {
        const unwrapSelected = list?.map(({ value }) => value) ?? [];

        return this.config.multiple 
            ? unwrapSelected 
            : unwrapSelected?.[0];
    }

    public optionCompare = (option: MatOption | object, selection: MatOption | object): boolean => {
        if (this.config?.compareMap) {
            const o1 = format<object>(this.config.compareMap, (option instanceof MatOption ? option.value : option) ?? {});
            const o2 = format<object>(this.config.compareMap, (selection instanceof MatOption ? selection.value : selection) ?? {});

            return _.isMatch(o1, o2);
        }

        return option === selection;
    };

    public change(value: any): void {
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