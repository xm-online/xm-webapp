import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SERVER_API_URL } from '../../xm.constants';
import { XmEntitySpec } from './xm-entity-spec.model';

@Injectable()
export class XmEntitySpecService {

    private resourceUrl: string = SERVER_API_URL + 'entity/api/xm-entity-specs';

    constructor(private http: HttpClient) {
    }

    public get(): Observable<XmEntitySpec[]> {
        if (!environment.production) {
            console.log(`getting ${this.resourceUrl}`);
        }
        return this.http.get<XmEntitySpec[]>(this.resourceUrl);
    }

    public generateXmEntity(typeKey: string): Observable<any> {
        return this.http.post(`${this.resourceUrl}//generate-xm-entity?rootTypeKey=${typeKey}`, null);
    }

}
