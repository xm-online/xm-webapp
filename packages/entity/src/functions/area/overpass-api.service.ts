import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class OverpassApiService {

    public OVERPASS_API_URL: string = 'https://www.overpass-api.de';

    /**
     * @param http - `{Object}` angular http service
     */
    constructor(private http: HttpClient) {
    }

    /**
     * @param query - `{Object/String}`
     * http://wiki.openstreetmap.org/wiki/FR:Overpass_API
     * @returns `{Observable}` http.get
     */
    public overpass(query: string): Observable<any> {
        return this.http.get(this.OVERPASS_API_URL + '/api/interpreter?data=' + query);
    }

    /**
     * Returns list with OSM objects by start term of name and where type is boundary
     * @param name - {@link String}
     * @returns {@link Observable} http.get
     */
    public getBoundariesByName(name: string): Observable<any> {
        return this.overpass(`[out:json];rel[~"name"~"^${name}",i]["type"="boundary"];out body;`);
    }

    /**
     * Returns geometry for the relation by OSM Id
     * @param osmId - `{String}`
     * @returns `{Observable}` http.get
     */
    public getRelGeom(osmId: string): Observable<any> {
        return this.overpass(`[out:json];rel(${osmId});out geom;`);
    }

}
