import { HttpHeaders } from '@angular/common/http';
import { OnInit, OnDestroy, OnChanges, Input, inject, SimpleChanges, Directive } from '@angular/core';
import { coerceArray } from '@angular/flex-layout';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { format, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { LanguageService } from '@xm-ngx/translation';
import _ from 'lodash';
import { Subject, Observable, BehaviorSubject, startWith, map, switchMap, of, tap, distinctUntilChanged, debounceTime, catchError, finalize, shareReplay } from 'rxjs';
import { EntityCollectionFactoryService } from '../entity-collection';
import { NgModelWrapper } from '../ng-accessor';
import { AUTOCOMPLETE_CONTROL_DEFAULT_CONFIG, XmAutocompleteControlConfig, XmAutocompleteControlMapper, XmAutocompleteControlListItem, XmAutocompleteControlParams, XmAutocompleteControlBody } from './autocomple-control.interface';

@Directive()
export class XmAutocompleteControl extends NgModelWrapper<object | string> implements OnInit, OnDestroy, OnChanges {
    private refreshValue = new Subject<void>();

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

    protected fetchedList = new BehaviorSubject<XmAutocompleteControlListItem[]>([]);
    protected searchedList = new BehaviorSubject<XmAutocompleteControlListItem[]>([]);

    public list = new BehaviorSubject<XmAutocompleteControlListItem[]>([]);

    private _loading = new BehaviorSubject<boolean>(false);
    public get loading(): Observable<boolean> {
        return this._loading.asObservable().pipe(shareReplay(1));
    }

    public ngOnInit(): void {
        this.refreshValue.pipe(
            startWith(null),
            switchMap(() => {
                if (_.isEmpty(this.value)) {
                    return of([]);
                }

                if (!this.requestCache) {
                    const normalizeSelectedValues = this.normalizeCollection(this.value);

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
                        shareReplay(1),
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

        this.fetchedList.pipe(
            switchMap((fetch) => this.searchedList.pipe(
                map((search) => [fetch, search])
            )),
            map(([fetchedSelectedValues, search]) => {
                return _.uniqWith(fetchedSelectedValues.concat(search), (a, b) => this.identityFn(a, b));
            }),
            tap((values) => {
                this.list.next(values);
            }),
            takeUntilOnDestroy(this),
        ).subscribe();

        if (this.config.startEmptySearch) {
            this.searchQueryControl.setValue('');
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {           
        this.refreshValue.next();
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
            data: item,
        };
    }

    private normalizeCollection(collection: unknown): XmAutocompleteControlListItem[] {
        return coerceArray(collection)
            .filter(value => !_.isEmpty(value))
            .map((item) => this.normalizeModel(item as object));
    }

    protected unwrapValues(list: XmAutocompleteControlListItem[]): unknown | unknown[] {
        const unwrapSelected = list?.map(({ value }) => value) ?? [];

        return this.config.multiple 
            ? unwrapSelected 
            : unwrapSelected?.[0];
    }

    protected identity<T>(item: unknown): T {
        return format(this.config.compareMap, item);
    }

    public identityFn = (option: MatOption | object, selection: MatOption | object): boolean => {
        if (this.config?.compareMap) {
            const o1 = this.identity<object>((option instanceof MatOption ? option.value : option) ?? {});
            const o2 = this.identity<object>((selection instanceof MatOption ? selection.value : selection) ?? {});

            return _.isMatch(o1, o2);
        }

        return option === selection;
    };

    public setDisabledState(isDisabled: boolean): void {
        isDisabled 
            ? this.searchQueryControl.disable({ emitEvent: false })
            : this.searchQueryControl.enable({ emitEvent: false });

        super.setDisabledState(isDisabled);
    }

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