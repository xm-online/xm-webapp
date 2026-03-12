import { Component, DestroyRef, effect, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { XmDynamicPresentationConstructor } from '@xm-ngx/dynamic';
import { EntityCollectionFactoryService } from '@xm-ngx/repositories';
import { get } from 'lodash';
import { clone } from 'lodash/fp';
import { Subscription } from 'rxjs';

export interface ByEntityQueryValueOptions {
    resourceUrl: string;
    searchField: string;
    displayField: string;
    extraParams?: Record<string, unknown>;
    searchUrl?: string;
    queryTemplate?: string;
    searchSize?: number;
}

export const BY_ENTITY_QUERY_VALUE_OPTIONS: ByEntityQueryValueOptions = {
    resourceUrl: '/entity/api/xm-entities',
    searchField: 'key',
    displayField: 'name',
    extraParams: {},
    searchSize: 100,
};

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

    protected defaultOptions: ByEntityQueryValueOptions = clone(BY_ENTITY_QUERY_VALUE_OPTIONS);

    private subscription: Subscription | null = null;
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
                const queryTemplate = config?.queryTemplate ?? '';
                const searchSize = config?.searchSize ?? this.defaultOptions.searchSize ?? 100;
                const serializedValue = value !== null && typeof value === 'object' ? JSON.stringify(value) : (value as string | number | boolean).toString();
                const resolvedQuery = queryTemplate.replace(/{{value}}/g, serializedValue);

                const collection = this.factoryService.create<unknown>(searchUrl);
                this.subscription = collection.query({
                    size: searchSize,
                    query: resolvedQuery,
                    ...extraParams,
                }).subscribe((res) => {
                    const results = res.body;
                    this.fieldValue.set(
                        Array.isArray(results) && results.length > 0
                            ? get(results[0], displayField)
                            : '',
                    );
                });
            } else {
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
                            ? get(results[0], displayField)
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
