import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AHttpRestHandler } from './handlers/a-http-rest-handler';
import { HeadersHandler } from './handlers/headers-handler';
import { LoadingHttpRestHandler } from './handlers/loading-http-rest-handler';
import { ENTITY_COLLECTION_CONFIG } from './injectors';
import { EntityCollectionConfig, IId } from './models';
import { HttpClientRest } from './rest/http-client-rest';
import { UrlRestFactory } from './url/url-rest-factory';


@Injectable()
export class EntityCollectionFactoryService {

    constructor(protected readonly httpClient: HttpClient,
                @Inject(ENTITY_COLLECTION_CONFIG) protected readonly config: EntityCollectionConfig) {
    }

    /** @param plural - api slug where entity rest implemented */
    public create<T extends IId>(plural: string): {
        loading: LoadingHttpRestHandler<T>,
        collection: AHttpRestHandler<T>,
    } {

        const url = UrlRestFactory(this.config.root + plural);

        const loading: LoadingHttpRestHandler<T> = new LoadingHttpRestHandler<T>();
        const headers: HeadersHandler<T> = new HeadersHandler<T>();
        const api: HttpClientRest<T> = new HttpClientRest<T>(url, this.httpClient);

        headers.next = loading;
        loading.next = api;

        return {
            loading: loading,
            collection: headers,
        };

    }
}
