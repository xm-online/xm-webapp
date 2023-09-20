import {SelectionModel} from '@angular/cdk/collections';
import {HttpHeaders} from '@angular/common/http';
import {
    Directive,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    SimpleChanges,
    SkipSelf,
} from '@angular/core';
import {coerceArray} from '@angular/flex-layout';
import {FormControl, NgControl} from '@angular/forms';
import {format, takeUntilOnDestroy, takeUntilOnDestroyDestroy} from '@xm-ngx/operators';
import {LanguageService} from '@xm-ngx/translation';
import _ from 'lodash';
import {
    BehaviorSubject,
    catchError,
    debounceTime,
    distinctUntilChanged,
    filter,
    finalize,
    map,
    Observable,
    of,
    pairwise,
    shareReplay,
    startWith,
    switchMap,
    tap,
} from 'rxjs';
import {EntityCollectionFactoryService} from '@xm-ngx/repositories';
import {NgModelWrapper} from '@xm-ngx/components/ng-accessor';
import {
    AUTOCOMPLETE_CONTROL_DEFAULT_CONFIG,
    XmAutocompleteControlBody,
    XmAutocompleteControlConfig,
    XmAutocompleteControlListItem,
    XmAutocompleteControlMapper,
    XmAutocompleteControlParams,
} from './autocomple-control.interface';
import {XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES} from '@xm-ngx/components/validator-processing';

@Directive()
export class XmAutocompleteControl extends NgModelWrapper<object | string> implements OnInit, OnDestroy, OnChanges {
    private _config: XmAutocompleteControlConfig = AUTOCOMPLETE_CONTROL_DEFAULT_CONFIG;

    @Input()
    public set config(value: XmAutocompleteControlConfig) {
        this._config = _.defaultsDeep(value, AUTOCOMPLETE_CONTROL_DEFAULT_CONFIG) as XmAutocompleteControlConfig;

        const {
            displayFn,
            valueByKey,
        } = format<XmAutocompleteControlMapper>(this.config?.itemMapper, this.getLocaleContext());

        this.displayFn = _.template(displayFn);
        this.valueByKey = _.isObject(valueByKey)
            ? _.template(JSON.stringify(valueByKey))
            : _.template(valueByKey);
    }

    public get config(): XmAutocompleteControlConfig {
        return this._config;
    }

    private _updateValues = new BehaviorSubject<{ emit: boolean; value: unknown[] }>(null);

    public updateValuesChnaged = this._updateValues.asObservable();

    private displayFn: _.TemplateExecutor;
    private valueByKey: _.TemplateExecutor;

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

    public selection: SelectionModel<XmAutocompleteControlListItem>;
    public selected: unknown | unknown[];

    public messageErrors = XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES;

    constructor(
        @Optional() @SkipSelf() public ngControl: NgControl,
    ) {
        super();
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    public ngOnInit(): void {
        this.selection = new SelectionModel<XmAutocompleteControlListItem>(this.config.multiple, [], true, this.identityFn);

        this.selection.changed.asObservable().pipe(
            tap((changed) => {
                const selected = changed.source.selected;

                this.selected = this.config.multiple
                    ? selected
                    : selected?.[0];
            }),
            takeUntilOnDestroy(this),
        ).subscribe();

        this.updateValuesChnaged.pipe(
            startWith(null),
            pairwise(),
            filter(([prev, curr]) => {
                const isEmit = (curr?.emit == null || curr?.emit == true);
                const hasNewValues = this.hasNewValues(prev?.value, curr?.value);

                return isEmit && hasNewValues;
            }),
            switchMap(([prev, curr]) => {
                if (_.isEmpty(curr.value)) {
                    return of([]);
                }

                const normalizeSelectedValues = this.normalizeValues(curr.value);

                if (this.config.skipFetchSelected) {
                    return of(normalizeSelectedValues);
                }

                return this.fetchSelectedValues(normalizeSelectedValues).pipe(
                    map((fetchedSelectedValues) => {
                        // If we received more data than requested, trying filter them
                        if (fetchedSelectedValues.length > normalizeSelectedValues.length && this.config.pickIntersectSelected) {
                            return _.intersectionBy(fetchedSelectedValues, normalizeSelectedValues, 'value');
                        }

                        return fetchedSelectedValues;
                    }),
                    shareReplay(1),
                );
            }),
            tap(fetchedSelectedValues => {
                if (this.config.multiple) {
                    this.selection.select(...fetchedSelectedValues);
                } else {
                    const [firstFetched] = fetchedSelectedValues;

                    if (firstFetched) {
                        this.selection.select(firstFetched);
                    }
                }
                this.fetchedList.next(fetchedSelectedValues);
            }),
            takeUntilOnDestroy(this),
        ).subscribe();

        this.searchQueryControl.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(300),
            filter(searchQuery => searchQuery?.length === 0 || (searchQuery?.length >= this.config.startFromCharSearch)),
            switchMap((searchQuery) => {
                if (this.isEmptySearchResult(searchQuery)) {
                    return of([]);
                }
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
                map((search) => [fetch, search]),
            )),
            map(([fetchedSelectedValues, search]) => {
                return this.uniqByIdentity(fetchedSelectedValues, search);
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

    private isEmptySearchResult(searchQuery: string): boolean {
        const isSearchLimited: boolean = searchQuery?.length < this.config.startFromCharSearch;
        return !this.config.startEmptySearch && (!searchQuery?.length || isSearchLimited);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.clearEmptyValue(changes?.value?.currentValue);

        // Prevent make another request
        if (this.list.value.length <= 0) {
            this.setUpdatedValues(changes?.value?.currentValue);
        }
    }

    public writeValue(value: unknown[]): void {
        this.clearEmptyValue(value);
        this.setUpdatedValues(value);
    }

    private setUpdatedValues(value: unknown[], emit = true): void {
        this._updateValues.next({
            value: _.cloneDeep(value),
            emit,
        });
    }

    private clearEmptyValue(value: unknown | unknown[]): void {
        if (_.isEmpty(value)) {
            this.selection?.clear();
        }
    }

    private uniqByIdentity(source: XmAutocompleteControlListItem[], target: XmAutocompleteControlListItem[]): XmAutocompleteControlListItem[] {
        return _.uniqWith(source.concat(target), (a, b) => this.identityFn(a, b));
    }

    private hasNewValues(prev: unknown[], curr: unknown[]): boolean {
        const unwrapPrev = this.unwrapValues(this.normalizeValues(prev));
        const unwrapCurr = this.unwrapValues(this.normalizeValues(curr));

        return !_.isEqual(unwrapPrev, unwrapCurr);
    }

    private searchByQuery(searchQuery: string): Observable<XmAutocompleteControlListItem[]> {
        const {queryParams, body} = this.config?.search || {};

        const httpParams = this.formatRequestParams(queryParams, this.getSearchCriteriaContext(searchQuery));
        const httpBody = this.formatRequestParams(body, this.getSearchCriteriaContext(searchQuery));

        return this.buildRequest(httpParams, httpBody);
    }

    private fetchSelectedValues(values: XmAutocompleteControlListItem[]): Observable<XmAutocompleteControlListItem[]> {
        const {queryParams, body} = this.config?.fetchSelectedByCriteria || {};

        const httpParams = this.formatRequestParams(queryParams, this.getSearchCriteriaContext(values));
        const httpBody = this.formatRequestParams(body, this.getSearchCriteriaContext(values));

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
        const {locale, languages} = this.languageService;

        return {
            locale,
            languages,
        };
    }

    private buildRequest(httpParams: XmAutocompleteControlParams, httpBody: XmAutocompleteControlBody): Observable<XmAutocompleteControlListItem[]> {
        this._loading.next(true);

        const {resourceUrl, resourceMethod, headers} = this.config?.search || {};

        if (resourceUrl) {
            return this.collectionFactory.create(resourceUrl).request(
                resourceMethod,
                httpBody,
                httpParams,
                new HttpHeaders(headers),
            ).pipe(
                map((data) => {
                    if (this.config?.extractByKey) {
                        data = _.get(data, this.config?.extractByKey, []);
                    }

                    if (!_.isEmpty(this.config.formatBackendData)) {
                        data = coerceArray(data).map((item) => {
                            return format(this.config.formatBackendData, item);
                        });
                    }

                    return data;
                }),
                map(collection => this.normalizeValues(collection)),
                finalize(() => this._loading.next(false)),
            );
        }

        return of([]);
    }

    private formatRequestParams(params: XmAutocompleteControlParams, context: unknown): XmAutocompleteControlParams {
        return _.omitBy(format<XmAutocompleteControlParams>(params, context), _.isEmpty);
    }

    private normalizeValues(collection: unknown): XmAutocompleteControlListItem[] {
        return coerceArray(collection)
            .filter(value => !_.isEmpty(value))
            .map((item: any) => {
                if (_.isObject(item)) {
                    const stringOrObject = this.valueByKey(item);

                    let value = stringOrObject;

                    if (this.config.valueAsJson) {
                        try {
                            value = JSON.parse(stringOrObject);
                        } catch (error) {
                        }
                    }

                    return {
                        value,
                        view: this.displayFn(item),
                        data: item,
                    };
                }

                return {
                    value: item,
                    view: item,
                    data: item,
                };
            });
    }

    protected unwrapValues(valueOrValues: XmAutocompleteControlListItem | XmAutocompleteControlListItem[]): unknown | unknown[] {
        if (_.isArray(valueOrValues)) {
            const unwrapSelected = valueOrValues?.map(({value}) => value) ?? [];

            return this.config.multiple
                ? unwrapSelected
                : unwrapSelected?.[0];
        }

        const {value} = valueOrValues;

        return value;
    }

    protected identityFormat<T>(item: unknown): T {
        return format(this.config.compareMap, item);
    }

    public identityFn = (option: XmAutocompleteControlListItem, selection: XmAutocompleteControlListItem): boolean => {
        if (_.isEmpty(option) || _.isEmpty(selection)) {
            return false;
        }

        if (this.config?.compareMap) {
            const o1 = this.identityFormat<object>(option);
            const o2 = this.identityFormat<object>(selection);

            return _.isMatch(o1, o2);
        }

        return option === selection;
    };

    public setDisabledState(isDisabled: boolean): void {
        isDisabled
            ? this.searchQueryControl.disable({emitEvent: false})
            : this.searchQueryControl.enable({emitEvent: false});

        super.setDisabledState(isDisabled);
    }

    public change(normalizeValues: any): void {
        let unwrapValues = normalizeValues;

        if (normalizeValues != null) {
            if (_.isArray(normalizeValues)) {
                this.selection.select(...normalizeValues);
            } else {
                this.selection.select(normalizeValues);
            }

            unwrapValues = this.unwrapValues(normalizeValues);
        }

        this.value = unwrapValues;

        this._onChange(unwrapValues);
        this.valueChange.next(unwrapValues);
        /**
         * This needed cause we use pairwise for check new values
         * Possible scenario when we set same value as previously
         */
        this.setUpdatedValues(unwrapValues, false);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
