import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../xm.constants';
import { Event } from './event.model';
import { dateParse, RestfulBase, toDate } from './restful-base';

@Injectable()
export class EventService extends RestfulBase<Event> {

    constructor(protected http: HttpClient) {
        super(http);
        this.resourceUrl = SERVER_API_URL + 'entity/api/events';
        this.resourceSearchUrl = SERVER_API_URL + 'entity/api/_search/events';
    }

    protected convertFromServer(data: Event): Event {
        data.startDate = dateParse(data.startDate);
        data.endDate = dateParse(data.endDate);
        return data;
    }

    protected convertForServer(data: Event): Event {
        data = Object.assign({}, data);
        data.startDate = toDate(data.startDate);
        data.endDate = toDate(data.endDate);
        return data;
    }

}
