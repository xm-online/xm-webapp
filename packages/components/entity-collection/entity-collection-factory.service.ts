import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientRest } from './http-client.rest';
import { IEntityCollection } from './i-entity-collection';

@Injectable({
    providedIn: 'root',
})
export class EntityCollectionFactoryService {

    constructor(protected readonly httpClient: HttpClient) {
    }

    /** @param plural - api slug where entity rest implemented
     * @param clearUrl - interpolated url
     */
    public create<T>(plural: string, clearUrl = plural): IEntityCollection<T> {
        return new HttpClientRest<T>(clearUrl, this.httpClient);
    }
}
