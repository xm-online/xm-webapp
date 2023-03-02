import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Spec } from './spec.model';

@Injectable()
export class BalanceSpecService {

    private resourceUrl: string = 'config/api/profile/balance/balancespec.yml?toJson';

    constructor(private http: HttpClient) {
    }

    public get(): Observable<HttpResponse<Spec>> {
        return this.http.get<Spec>(this.resourceUrl, {observe: 'response'});
    }

}
