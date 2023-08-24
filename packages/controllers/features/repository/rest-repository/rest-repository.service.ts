import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { format } from '@xm-ngx/operators';
import { EntityCollectionFactoryService } from '@xm-ngx/repositories';
import { LanguageService } from '@xm-ngx/translation';
import { isArray } from 'lodash';
import { catchError, map, Observable, of } from 'rxjs';
import { RestResourceConfig } from './rest-repository.model';

@Injectable()
export class RestRepositoryService<T = any> {
    private collectionFactory = inject(EntityCollectionFactoryService);
    private languageService = inject(LanguageService);
    private route = inject(ActivatedRoute);

    public config: RestResourceConfig;


    /** POST request. Use to create an entity. */
    // public create(entity: T, params?: Record<string, any>): Observable<HttpResponse<T>> {
    //     return of(entity);
    // }

    /** DELETE request. Use to delete an entity by id. */

    // delete(id: Id, params?: QueryParams): Observable<HttpResponse<unknown>>;

    /** GET request. Use to get an entity by id. */
    public get(params?: Record<string, any>): Observable<T> {
        return this.fetch(params);
    }

    /** PATCH request. Use to replace entity data. */

    public update(entity: T, params?: Record<string, any>): Observable<T> {
        const resource = this.config?.byType?.update || this.config.resource;

        const {
            url,
            method = 'POST',
            headers = {},
        } = resource ?? {};

        if (!url) {
            return of(null);
        }
        const formattedUrl = this.getRequestContext({url}).url;
        const client = this.collectionFactory.create(formattedUrl);

        const {
            body,
            queryParams = {},
        } = resource ?? {};

        const ctxBody = body ? this.getRequestContext(body, entity) : entity;
        const ctxQueryParams = this.getRequestContext(queryParams, params);

        return client.request(
            method,
            ctxBody,
            ctxQueryParams,
            headers,
        ).pipe(
            map((data) => isArray(data) ? data?.[0] : data),
            catchError((error) => {
                console.warn(error);

                return of(null);
            }),
        );
    }

    /** PUT request. Use to replace or delete entity data. */
    // replace(update: Partial<T>, params?: QueryParams): Observable<HttpResponse<T>>;


    private fetch<T = any>(context: Record<string, any> = {}): Observable<T> {
        const {resource} = this.config;

        const {
            url,
            method = 'GET',
            headers = {},
        } = resource ?? {};

        if (!url) {
            return of(null);
        }
        const formattedUrl = this.getRequestContext({url}).url;
        const client = this.collectionFactory.create(formattedUrl);

        let {
            body = {},
            queryParams = {},
        } = resource ?? {};

        body = this.getRequestContext(body, context);
        queryParams = this.getRequestContext(queryParams, context);

        return client.request(
            method,
            body,
            queryParams,
            headers,
        ).pipe(
            map((data) => isArray(data) ? data?.[0] : data),
            catchError((error) => {
                console.warn(error);

                return of(null);
            }),
        );
    }

    private getRequestContext(objectTemplate: Record<string, string>, context: Params = {}): Record<string, string> {
        const {locale, languages} = this.languageService;

        let data = {};

        try {
            data = format(objectTemplate, {
                locale,
                languages,
                query: this.route.snapshot.queryParams,
                context
            });
        } catch (error) {
            console.warn(error);
        }

        return data;
    }
}
