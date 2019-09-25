import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../xm.constants';
import { dateParse, RestfulBase, toDate } from './restful-base';
import { Vote } from './vote.model';

@Injectable()
export class VoteService extends RestfulBase<Vote> {

    constructor(protected http: HttpClient) {
        super(http);
        this.resourceUrl = SERVER_API_URL + 'entity/api/votes';
        this.resourceSearchUrl = SERVER_API_URL + 'entity/api/_search/votes';
    }

    protected convertFromServer(data: Vote): Vote {
        data.entryDate = dateParse(data.entryDate);
        return data;
    }

    protected convertForServer(data: Vote): Vote {
        data = Object.assign({}, data);
        data.entryDate = toDate(data.entryDate);
        return data;
    }

}
