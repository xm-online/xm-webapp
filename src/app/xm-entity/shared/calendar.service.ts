import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../xm.constants';
import { Calendar } from './calendar.model';
import { dateParse, RestfulBase, toDate } from './restful-base';

@Injectable()
export class CalendarService extends RestfulBase<Calendar> {

    constructor(protected http: HttpClient) {
        super(http);
        this.resourceUrl = SERVER_API_URL + 'entity/api/calendars';
        this.resourceSearchUrl = SERVER_API_URL + 'entity/api/_search/calendars';
    }

    protected convertFromServer(data: Calendar): Calendar {
        data.startDate = dateParse(data.startDate);
        data.endDate = dateParse(data.endDate);
        return data;
    }

    protected convertForServer(data: Calendar): Calendar {
        data = Object.assign({}, data);
        data.startDate = toDate(data.startDate);
        data.endDate = toDate(data.endDate);
        return data;
    }

}
