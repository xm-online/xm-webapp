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

    /** @param resource - api slug where entity rest implemented
     * @param url - interpolated url
     */
    public create<T>(resource: string, url = resource): IEntityCollection<T> {
        return new HttpClientRest<T>(url, this.httpClient);
    }
}
