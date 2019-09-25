import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../xm.constants';
import { FunctionContext } from './function-context.model';
import { dateParse, RestfulBase, toDate } from './restful-base';

@Injectable()
export class FunctionContextService extends RestfulBase<FunctionContext> {

    constructor(protected http: HttpClient) {
        super(http);
        this.resourceUrl = SERVER_API_URL + 'entity/api/function-contexts';
        this.resourceSearchUrl = SERVER_API_URL + 'entity/api/_search/function-contexts';
    }

    protected convertFromServer(data: FunctionContext): FunctionContext {
        data.startDate = dateParse(data.startDate);
        data.updateDate = dateParse(data.updateDate);
        data.endDate = dateParse(data.endDate);
        return data;
    }

    protected convertForServer(data: FunctionContext): FunctionContext {
        data = Object.assign({}, data);
        data.startDate = toDate(data.startDate);
        data.updateDate = toDate(data.updateDate);
        data.endDate = toDate(data.endDate);
        return data;
    }

}
