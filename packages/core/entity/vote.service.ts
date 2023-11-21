import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Vote } from './vote.model';

@Injectable()
export class VoteService {

    private resourceUrl: string ='entity/api/votes';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    public create(vote: Vote): Observable<HttpResponse<Vote>> {
        const copy = this.convert(vote);
        return this.http.post<Vote>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Vote>) => this.convertResponse(res)));
    }

    public update(vote: Vote): Observable<HttpResponse<Vote>> {
        const copy = this.convert(vote);
        return this.http.put<Vote>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Vote>) => this.convertResponse(res)));
    }

    public find(id: number): Observable<HttpResponse<Vote>> {
        return this.http.get<Vote>(`${this.resourceUrl}/${id}`, {observe: 'response'}).pipe(
            map((res: HttpResponse<Vote>) => this.convertResponse(res)));
    }

    public delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: HttpResponse<Vote>): HttpResponse<Vote> {
        const body: Vote = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Vote.
     */
    private convertItemFromServer(vote: Vote): Vote {
        const copy: Vote = Object.assign({}, vote);
        copy.entryDate = this.dateUtils
            .convertDateTimeFromServer(vote.entryDate);
        return copy;
    }

    /**
     * Convert a Vote to a JSON which can be sent to the server.
     */
    private convert(vote: Vote): Vote {
        const copy: Vote = Object.assign({}, vote);

        copy.entryDate = this.dateUtils.toDate(vote.entryDate);
        return copy;
    }
}
