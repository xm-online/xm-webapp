import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Rating } from './rating.model';

@Injectable()
export class RatingService {

    private resourceUrl: string ='entity/api/ratings';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    public create(rating: Rating): Observable<HttpResponse<Rating>> {
        const copy = this.convert(rating);
        return this.http.post<Rating>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Rating>) => this.convertResponse(res)));
    }

    public update(rating: Rating): Observable<HttpResponse<Rating>> {
        const copy = this.convert(rating);
        return this.http.put<Rating>(this.resourceUrl, copy, {observe: 'response'}).pipe(
            map((res: HttpResponse<Rating>) => this.convertResponse(res)));
    }

    public find(id: number): Observable<HttpResponse<Rating>> {
        return this.http.get<Rating>(`${this.resourceUrl}/${id}`, {observe: 'response'}).pipe(
            map((res: HttpResponse<Rating>) => this.convertResponse(res)));
    }

    public countVotes(ratingId: number): Observable<{count: number}> {
        return this.http.get<{count: number}>(`${this.resourceUrl}/${ratingId}/votes/count`, {observe: 'response'}).pipe(
            map((res: HttpResponse<{count: number}>) => res.body));
    }

    public delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: HttpResponse<Rating>): HttpResponse<Rating> {
        const body: Rating = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Rating.
     */
    private convertItemFromServer(rating: Rating): Rating {
        const copy: Rating = Object.assign({}, rating);
        copy.startDate = this.dateUtils
            .convertDateTimeFromServer(rating.startDate);
        copy.endDate = this.dateUtils
            .convertDateTimeFromServer(rating.endDate);
        return copy;
    }

    /**
     * Convert a Rating to a JSON which can be sent to the server.
     */
    private convert(rating: Rating): Rating {
        const copy: Rating = Object.assign({}, rating);

        copy.startDate = this.dateUtils.toDate(rating.startDate);

        copy.endDate = this.dateUtils.toDate(rating.endDate);
        return copy;
    }

}
