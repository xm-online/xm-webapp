import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BodyHttpHandler } from '../handlers/body-http-handler';
import { HeadersHandler } from '../handlers/headers-handler';
import { LoadHttpHandler } from '../handlers/load-http-handler';
import { ENTITY_COLLECTION_CONFIG } from '../injectors';
import { EntityCollectionConfig, IId } from '../models';
import { HttpClientRest } from '../rest/http-client-rest';
import { UrlRest } from '../rest/url-rest';
import { IEntityCollection } from './i-entity-collection';

@Injectable()
export class EntityCollectionFactoryService {

    constructor(protected readonly httpClient: HttpClient,
                @Inject(ENTITY_COLLECTION_CONFIG) protected readonly config: EntityCollectionConfig) {
    }

    /** @param plural - api slug where entity rest implemented */
    public create<T extends IId>(plural: string): {
        loading: LoadHttpHandler<T>,
        collection: IEntityCollection<T>,
    } {

        const url: UrlRest<T> = new UrlRest(this.config.root + plural);

        const load: LoadHttpHandler<T> = new LoadHttpHandler();
        const headers: HeadersHandler<T> = new HeadersHandler();
        const body: BodyHttpHandler<T> = new BodyHttpHandler();
        const rest: HttpClientRest<T> = new HttpClientRest(url, this.httpClient);

        body.next = headers;
        headers.next = load;
        load.next = rest;

        return {
            loading: load,
            collection: body as any,
        };

    }
}
