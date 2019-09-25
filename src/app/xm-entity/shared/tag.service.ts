import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../xm.constants';
import { dateParse, RestfulBase, toDate } from './restful-base';
import { Tag } from './tag.model';

@Injectable()
export class TagService extends RestfulBase<Tag> {

    constructor(protected http: HttpClient) {
        super(http);
        this.resourceUrl = SERVER_API_URL + 'entity/api/tags';
        this.resourceSearchUrl = SERVER_API_URL + 'entity/api/_search/tags';
    }

    protected convertFromServer(data: Tag): Tag {
        data.startDate = dateParse(data.startDate);
        return data;
    }

    protected convertForServer(data: Tag): Tag {
        data = Object.assign({}, data);
        data.startDate = toDate(data.startDate);
        return data;
    }

}
