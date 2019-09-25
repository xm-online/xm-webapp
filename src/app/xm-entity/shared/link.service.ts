import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../xm.constants';
import { Link } from './link.model';
import { dateParse, RestfulBase, toDate } from './restful-base';

@Injectable()
export class LinkService extends RestfulBase<Link> {

    constructor(protected http: HttpClient) {
        super(http);
        this.resourceUrl = SERVER_API_URL + 'entity/api/links';
        this.resourceSearchUrl = SERVER_API_URL + 'entity/api/_search/links';
    }

    protected convertFromServer(data: Link): Link {
        data.startDate = dateParse(data.startDate);
        data.endDate = dateParse(data.endDate);
        return data;
    }

    protected convertForServer(data: Link): Link {
        data = Object.assign({}, data);
        data.startDate = toDate(data.startDate);
        data.endDate = toDate(data.endDate);
        return data;
    }

}
