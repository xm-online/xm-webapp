import { IId } from '../models';
import { IHttpRest } from '../rest/i-http-rest';

export interface IHttpRestHandler<T extends IId> extends IHttpRest<T> {
    next: IHttpRestHandler<T>;
}
