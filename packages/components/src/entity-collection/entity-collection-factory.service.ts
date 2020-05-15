import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEntityCollection } from './i-entity-collection';
import { HttpClientRest } from './http-client.rest';

@Injectable({
    providedIn: 'root',
})
export class EntityCollectionFactoryService {

    constructor(protected readonly httpClient: HttpClient) {
    }

    /** @param plural - api slug where entity rest implemented */
    public create<T>(plural: string): IEntityCollection<T> {
        return new HttpClientRest<T>(plural, this.httpClient);
    }
}

