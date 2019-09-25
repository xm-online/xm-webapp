import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../xm.constants';
import { Comment } from './comment.model';
import { dateParse, RestfulBase, toDate } from './restful-base';

@Injectable()
export class CommentService extends RestfulBase<Comment> {

    constructor(protected http: HttpClient) {
        super(http);
        this.resourceUrl = SERVER_API_URL + 'entity/api/comments';
        this.resourceSearchUrl = SERVER_API_URL + 'entity/api/_search/comments';
    }

    protected convertFromServer(data: Comment): Comment {
        data.entryDate = dateParse(data.entryDate);
        return data;
    }

    protected convertForServer(data: Comment): Comment {
        data = Object.assign({}, data);
        data.entryDate = toDate(data.entryDate);
        return data;
    }

}
