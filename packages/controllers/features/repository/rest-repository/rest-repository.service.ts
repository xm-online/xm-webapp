import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { format } from '@xm-ngx/operators';
import { EntityCollectionFactoryService } from '@xm-ngx/repositories';
import { LanguageService } from '@xm-ngx/translation';
import { isArray } from 'lodash';
import { catchError, map, Observable, of } from 'rxjs';
import { RestResourceConfig } from './rest-repository.model';

@Injectable()
export class RestRepositoryService {
    private collectionFactory = inject(EntityCollectionFactoryService);
    private languageService = inject(LanguageService);
    private route = inject(ActivatedRoute);

    public config: RestResourceConfig;

    public fetch<T = any>(context: Record<string, any> = {}): Observable<T> {
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
