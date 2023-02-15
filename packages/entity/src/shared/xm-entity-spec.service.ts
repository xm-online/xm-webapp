import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { XmEntitySpec } from './xm-entity-spec.model';

@Injectable()
export class XmEntitySpecService {

    private resourceUrl: string = 'entity/api/xm-entity-specs';

    constructor(private http: HttpClient) {
    }

    public get(): Observable<HttpResponse<XmEntitySpec[]>> {
        return this.http.get<XmEntitySpec[]>(this.resourceUrl, {observe: 'response'});
    }

    public update(configContent: string): Observable<XmEntitySpec> {
        return this.http.post(this.resourceUrl, configContent);
    }

    public getAll(): Observable<XmEntitySpec[]> {
        return this.http.get<XmEntitySpec[]>(this.resourceUrl);
    }

}
