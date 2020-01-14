import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IId } from '../models';
import { ASingleHttpHandler, HandlerNext, HandlerRequest } from './a-single-http-handler';

type ObjWithDates = { [key: string]: Date | string } | null;

export function toDate(date: Date | any): string {
    if (date) {
        return date.toISOString();
    }
    return date;
}

/**
 * Convert fields with a type of Date to the ISO strings
 */
export function convertDates<T extends ObjWithDates>(obj: T | any): T {

    for (const prop in obj) {
        if (obj.hasOwnProperty(prop) && obj[prop] instanceof Date) {
            obj[prop] = toDate(obj[prop]);
        }
    }

    return obj;
}

export class  BodyHttpHandler<T extends IId> extends ASingleHttpHandler<T> {

    public handle<R>(request: HandlerRequest<T>, next: HandlerNext<T>): Observable<R> {
        return next().pipe(
            map((res) => {
                if (res.body && Array.isArray(res.body)) {
                    return this.convertArrayFromServer(res.body);
                }

                if (res.body && res.body.id) {
                    return this.convertFromServer(res.body as T);
                }

                return res.body;
            }),
        );
    }

    /**
     * Convert a T to a JSON which can be sent to the server.
     */
    protected convertForServer(entity: Partial<T>): Partial<T> {
        entity = Object.assign({}, entity);
        entity = convertDates<any>(entity);
        return entity;
    }

    /**
     * Convert a returned JSON object to T.
     */
    protected convertFromServer(entity: T): T {
        return entity;
    }

    protected convertArrayFromServer(entity: T[]): T[] {
        if (entity && Array.isArray(entity)) {
            entity = entity.map(this.convertFromServer.bind(this));
        }
        return entity;
    }
}
