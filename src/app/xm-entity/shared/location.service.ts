import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../xm.constants';
import { Location } from './location.model';
import { RestfulBase } from './restful-base';

@Injectable()
export class LocationService extends RestfulBase<Location> {

    constructor(protected http: HttpClient) {
        super(http);
        this.resourceSearchUrl = SERVER_API_URL + 'entity/api/_search/locations';
        this.resourceUrl = SERVER_API_URL + 'entity/api/locations';
    }

}
