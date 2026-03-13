import { Component, DestroyRef, effect, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { XmDynamicPresentationConstructor } from '@xm-ngx/dynamic';
import { EntityCollectionFactoryService } from '@xm-ngx/repositories';
import { get } from 'lodash';
import { clone } from 'lodash/fp';
import { catchError, of } from 'rxjs';
import { ByEntityQueryValueOptions } from './by-entity-query-value.interface';
import { BY_ENTITY_QUERY_VALUE_OPTIONS } from './by-entity-query-value.constant';

@Component({
    selector: 'xm-by-entity-query-value',
    host: { class: 'xm-by-entity-query-value' },
    template: '<span>{{ fieldValue() }}</span>',
    standalone: true,
})
export class ByEntityQueryValueComponent {
    public config: InputSignal<ByEntityQueryValueOptions> = input<ByEntityQueryValueOptions>();
    public value: InputSignal<unknown> = input<unknown>();
    public readonly fieldValue: WritableSignal<unknown> = signal<unknown>('');

    protected readonly defaultOptions: ByEntityQueryValueOptions = clone(BY_ENTITY_QUERY_VALUE_OPTIONS);
    protected readonly factoryService: EntityCollectionFactoryService = inject(EntityCollectionFactoryService);

    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    constructor() {
        // Effect runs automatically to react to input changes
        effect(() => this.update());
    }

    /**
     * Updates the field value based on the current input value and configuration.
     * Triggers a query to fetch data when value is valid.
     */
    protected update(): void {
        const value = this.value();
        const config = this.config();

        if (value !== null && value !== undefined && value !== '') {
            const displayField = config?.displayField ?? this.defaultOptions.displayField;
            const extraParams = config?.extraParams ?? this.defaultOptions.extraParams ?? {};
            const searchUrl = config?.searchUrl;

            if (searchUrl) {
                this.handleSearchUrlQuery(searchUrl, value, displayField, extraParams, config);
            } else {
                this.handleResourceUrlQuery(value, displayField, extraParams, config);
            }
        } else {
            this.fieldValue.set('');
        }
    }

    /**
     * Handles query using searchUrl with a query template.
     */
    private handleSearchUrlQuery(
        searchUrl: string,
        value: unknown,
        displayField: string,
        extraParams: Record<string, unknown>,
        config: ByEntityQueryValueOptions | undefined,
    ): void {
        const queryTemplate = config?.queryTemplate ?? '';
        const searchSize = config?.searchSize ?? this.defaultOptions.searchSize ?? 100;
        const serializedValue = value !== null && typeof value === 'object' ? JSON.stringify(value) : (value as string | number | boolean).toString();
        const resolvedQuery = queryTemplate.replace(/{{value}}/g, serializedValue);

        const collection = this.factoryService.create<unknown>(searchUrl);
        collection.query({
            size: searchSize,
            query: resolvedQuery,
            ...extraParams,
        }).pipe(
            catchError(() => of({ body: [] })),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe((res) => {
            const results = res.body;
            this.fieldValue.set(
                Array.isArray(results) && results.length > 0
                    ? get(results[0], displayField)
                    : '',
            );
        });
    }

    /**
     * Handles query using resourceUrl with a search field.
     */
    private handleResourceUrlQuery(
        value: unknown,
        displayField: string,
        extraParams: Record<string, unknown>,
        config: ByEntityQueryValueOptions | undefined,
    ): void {
        const resourceUrl = config?.resourceUrl ?? this.defaultOptions.resourceUrl;
        const searchField = config?.searchField ?? this.defaultOptions.searchField;

        const collection = this.factoryService.create<unknown>(resourceUrl);
        collection.query({
            [searchField]: value,
            ...extraParams,
        }).pipe(
            catchError(() => of({ body: [] })),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe((res) => {
            const results = res.body;
            this.fieldValue.set(
                Array.isArray(results) && results.length > 0
                    ? get(results[0], displayField)
                    : '',
            );
        });
    }
}

export const XM_BY_ENTITY_QUERY_VALUE_ENTRY = ByEntityQueryValueComponent satisfies XmDynamicPresentationConstructor;
