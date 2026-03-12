import { Component, DestroyRef, effect, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { XmDynamicPresentationConstructor } from '@xm-ngx/dynamic';
import { EntityCollectionFactoryService } from '@xm-ngx/repositories';
import { get } from 'lodash';
import { clone } from 'lodash/fp';
import { Subscription } from 'rxjs';

/** Options for {@link ByEntityQueryValueComponent}. */
export interface ByEntityQueryValueOptions {
    /** The resource API endpoint from which entities will be loaded via query. */
    resourceUrl: string;
    /**
     * The query parameter key used to search for an entity.
     * The component `value` (taken from the row `field`) is sent as the value of this param.
     * Example: `'key'` — sends `GET /entity/api/xm-entities?key=<value>`.
     * Ignored when `searchUrl` is set.
     */
    searchField: string;
    /**
     * Dot-path of the field to extract and display from the first matched entity.
     * Example: `'name'` — shows the `name` property of the matched entity.
     */
    displayField: string;
    /** Optional extra static query parameters merged into every request. */
    extraParams?: Record<string, unknown>;
    /**
     * When set, the component uses this URL (search v2 endpoint) instead of `resourceUrl`.
     * Example: `'/entity/api/_search/v2/xm-entities'`.
     */
    searchUrl?: string;
    /**
     * Lucene-style query template used when `searchUrl` is set.
     * The placeholder `{{value}}` is replaced with the current component value.
     * Example: `'typeKey:PRODUCT-OFFERING.GIFT AND stateKey:ACTIVE AND key:{{value}}'`.
     */
    queryTemplate?: string;
    /**
     * Result page size used when `searchUrl` is set.
     * Defaults to 100.
     */
    searchSize?: number;
}

/** Default component config. */
export const BY_ENTITY_QUERY_VALUE_OPTIONS: ByEntityQueryValueOptions = {
    resourceUrl: '/entity/api/xm-entities',
    searchField: 'key',
    displayField: 'name',
    extraParams: {},
    searchSize: 100,
};

/**
 * Displays a field from an entity found via `query()` by a configurable search param.
 *
 * The component `value` is the raw value from the data row (e.g. a key string taken from `field`).
 * It is sent to the API as `GET <resourceUrl>?<searchField>=<value>&...extraParams`.
 * The `displayField` of the first matched entity is then rendered.
 *
 * ### Config example (table cell)
 * ```json
 * {
 *   "selector": "@xm-ngx/components/by-entity-query-cell",
 *   "config": {
 *     "resourceUrl": "/entity/api/xm-entities",
 *     "searchField": "key",
 *     "displayField": "name"
 *   },
 *   "field": "data.productOfferingGiftKey",
 *   "name": "data.productOfferingGiftKey",
 *   "sortable": false
 * }
 * ```
 * The value of `data.productOfferingGiftKey` is passed as `value`.
 * The request becomes `GET /entity/api/xm-entities?key=<value>`.
 * The `name` of the first matched entity is displayed.
 *
 * @public
 */
@Component({
    selector: 'xm-by-entity-query-value',
    host: { class: 'xm-by-entity-query-value' },
    template: '<span>{{ fieldValue() }}</span>',
    standalone: true,
})
export class ByEntityQueryValueComponent {

    /** {@inheritDoc XmDynamicPresentation.config} */
    public config: InputSignal<ByEntityQueryValueOptions> = input<ByEntityQueryValueOptions>();

    /** {@inheritDoc XmDynamicPresentation.value} */
    public value: InputSignal<unknown> = input<unknown>();

    /** The resolved display value extracted from the matched entity. */
    public readonly fieldValue: WritableSignal<unknown> = signal<unknown>('');

    protected defaultOptions: ByEntityQueryValueOptions = clone(BY_ENTITY_QUERY_VALUE_OPTIONS);

    private subscription: Subscription;
    private destroyRef: DestroyRef = inject(DestroyRef);

    constructor(protected factoryService: EntityCollectionFactoryService) {
        effect(() => this.update());
        this.destroyRef.onDestroy(() => this.cancelSubscription());
    }

    protected update(): void {
        const value = this.value();
        const config = this.config();

        if (value !== null && value !== undefined && value !== '') {
            const displayField = config?.displayField ?? this.defaultOptions.displayField;
            const extraParams = config?.extraParams ?? this.defaultOptions.extraParams ?? {};
            const searchUrl = config?.searchUrl;

            this.cancelSubscription();

            if (searchUrl) {
                // Search v2 mode: use searchUrl with a Lucene queryTemplate
                const queryTemplate = config?.queryTemplate ?? '';
                const searchSize = config?.searchSize ?? this.defaultOptions.searchSize ?? 100;
                const resolvedQuery = queryTemplate.replace(/{{value}}/g, String(value));

                const collection = this.factoryService.create<unknown>(searchUrl);
                this.subscription = collection.query({
                    size: searchSize,
                    query: resolvedQuery,
                    ...extraParams,
                }).subscribe((res) => {
                    const results = res.body;
                    this.fieldValue.set(
                        Array.isArray(results) && results.length > 0
                            ? get(results[0], displayField ?? this.defaultOptions.displayField)
                            : '',
                    );
                });
            } else {
                // Classic mode: use resourceUrl with searchField as a query param
                const resourceUrl = config?.resourceUrl ?? this.defaultOptions.resourceUrl;
                const searchField = config?.searchField ?? this.defaultOptions.searchField;

                const collection = this.factoryService.create<unknown>(resourceUrl);
                this.subscription = collection.query({
                    [searchField]: value,
                    ...extraParams,
                }).subscribe((res) => {
                    const results = res.body;
                    this.fieldValue.set(
                        Array.isArray(results) && results.length > 0
                            ? get(results[0], displayField ?? this.defaultOptions.displayField)
                            : '',
                    );
                });
            }
        } else {
            this.fieldValue.set('');
        }
    }

    private cancelSubscription(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }
}

export const XM_BY_ENTITY_QUERY_VALUE_ENTRY = ByEntityQueryValueComponent satisfies XmDynamicPresentationConstructor;
