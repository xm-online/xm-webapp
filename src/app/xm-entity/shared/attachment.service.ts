import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../xm.constants';
import { Attachment } from './attachment.model';
import { dateParse, RestfulBase, toDate } from './restful-base';

@Injectable()
export class AttachmentService extends RestfulBase<Attachment> {

    constructor(protected http: HttpClient) {
        super(http);
        this.resourceUrl = SERVER_API_URL + 'entity/api/attachments';
        this.resourceSearchUrl = SERVER_API_URL + 'entity/api/_search/attachments';
    }

    protected convertFromServer(data: Attachment): Attachment {
        data.startDate = dateParse(data.startDate);
        data.endDate = dateParse(data.endDate);
        return data;
    }

    protected convertForServer(data: Attachment): Attachment {
        data = Object.assign({}, data);
        data.startDate = toDate(data.startDate);
        data.endDate = toDate(data.endDate);
        return data;
    }

}
