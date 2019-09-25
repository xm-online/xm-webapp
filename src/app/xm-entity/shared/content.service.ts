import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../xm.constants';
import { Content } from './content.model';
import { RestfulBase } from './restful-base';

@Injectable()
export class ContentService extends RestfulBase<Content> {

    constructor(protected http: HttpClient) {
        super(http);
        this.resourceUrl = SERVER_API_URL + 'entity/api/contents';
    }

}
