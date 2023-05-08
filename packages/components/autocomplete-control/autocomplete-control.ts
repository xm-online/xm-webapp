import { SelectionModel } from '@angular/cdk/collections';
import { HttpHeaders } from '@angular/common/http';
import {
    OnInit,
    OnDestroy,
    OnChanges,
    Input,
    inject,
    SimpleChanges,
    Directive,
    Optional,
    SkipSelf
} from '@angular/core';
import { coerceArray } from '@angular/flex-layout';
import { FormControl, NgControl } from '@angular/forms';
import { format, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { LanguageService } from '@xm-ngx/translation';
import _ from 'lodash';
import {
    Observable,
    BehaviorSubject,
    startWith,
    map,
    switchMap,
    of,
    tap,
    distinctUntilChanged,
    debounceTime,
    catchError,
    finalize,
    shareReplay,
    pairwise,
    filter
} from 'rxjs';
import { EntityCollectionFactoryService } from '../entity-collection';
import { NgModelWrapper } from '../ng-accessor';
import {
    AUTOCOMPLETE_CONTROL_DEFAULT_CONFIG,
    XmAutocompleteControlConfig,
    XmAutocompleteControlMapper,
    XmAutocompleteControlListItem,
    XmAutocompleteControlParams,
    XmAutocompleteControlBody
} from './autocomple-control.interface';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';

@Directive()
export class XmAutocompleteControl extends NgModelWrapper<object | string> implements OnInit, OnDestroy, OnChanges {
    private _config: XmAutocompleteControlConfig = AUTOCOMPLETE_CONTROL_DEFAULT_CONFIG;

    @Input()
    public set config(value: XmAutocompleteControlConfig) {
        this._config = _.defaultsDeep(value, AUTOCOMPLETE_CONTROL_DEFAULT_CONFIG) as XmAutocompleteControlConfig;

        const {
            displayFn,
            valueByKey
        } = format<XmAutocompleteControlMapper>(this.config?.itemMapper, this.getLocaleContext());

        this.displayFn = _.template(displayFn);
        this.valueByKey = _.isObject(valueByKey)
            ? _.template(JSON.stringify(valueByKey))
            : _.template(valueByKey);
    }

    public get config(): XmAutocompleteControlConfig {
        return this._config;
    }

    private _updateValues = new BehaviorSubject<unknown[]>(null);

    public set updateValues(value: unknown[]) {
        this._updateValues.next(_.cloneDeep(value));
    }

    public get updateValues(): unknown[] {
        return this._updateValues.value;
    }

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
            filter(([prev, curr]) => this.hasNewValues(prev, curr)),
            switchMap(([__, selectedValues]) => {
                const normalizeSelectedValues = this.normalizeValues(selectedValues);

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
                        this.selection.select(...[firstFetched]);
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

    public ngOnChanges(changes: SimpleChanges): void {
        // Prevent make another request
        if (this.list.value.length <= 0) {
            this.updateValues = changes?.value?.currentValue;
        }
    }

    public writeValue(value: unknown[]): void {
        this.updateValues = value;
    }

    private uniqByIdentity(source: XmAutocompleteControlListItem[], target: XmAutocompleteControlListItem[]): XmAutocompleteControlListItem[] {
        return _.uniqWith(source.concat(target), (a, b) => this.identityFn(a, b));
    }

    private hasNewValues(prev: unknown[], curr: unknown[]): boolean {
        if (_.isEmpty(curr)) {
            return false;
        }

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
                        return _.get(data, this.config?.extractByKey, []);
                    }

                    return data;
                }),
                map(collection => {
                    return this.normalizeValues(collection);
                }),
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
        let value = normalizeValues;

        if (value != null) {
            if (this.config.multiple && this.config.mergeControlValues) {
                value = this.uniqByIdentity(this.normalizeValues(this.value), normalizeValues);
            }

            value = this.unwrapValues(value);
        }

        this.value = value;

        this._onChange(value);
        this.valueChange.next(value);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
