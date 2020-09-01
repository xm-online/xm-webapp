import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_IMPORT_ENTITIES = '/entity/api/import/xm-entities';

@Injectable({
    providedIn: 'root'
})
export class ImportEntitiesService {

    constructor(private http: HttpClient) {
    }

    public importEntities(importDto: any): Observable<any> {
        return this.http.post(API_IMPORT_ENTITIES, importDto);
    }
}
