import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../xm.constants';
import { Rating } from './rating.model';
import { dateParse, RestfulBase, toDate } from './restful-base';

@Injectable()
export class RatingService extends RestfulBase<Rating> {

    constructor(protected http: HttpClient) {
        super(http);
        this.resourceUrl = SERVER_API_URL + 'entity/api/ratings';
        this.resourceSearchUrl = SERVER_API_URL + 'entity/api/_search/ratings';
    }

    protected convertFromServer(data: Rating): Rating {
        data.startDate = dateParse(data.startDate);
        data.endDate = dateParse(data.endDate);
        return data;
    }

    protected convertForServer(data: Rating): Rating {
        data = Object.assign({}, data);
        data.startDate = toDate(data.startDate);
        data.endDate = toDate(data.endDate);
        return data;
    }

}
