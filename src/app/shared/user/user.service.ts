import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS, XmUser } from '@xm-ngx/core';
import * as _ from 'lodash';
import { Observable, zip } from 'rxjs';

@Injectable()
export class UserService<T extends XmUser = any> {
    private resourceUrl: string = 'uaa/api/users';
    private resourceUrlByLogin: string = `${this.resourceUrl}/logins-contains`;

    constructor(private http: HttpClient) {
    }

    public create(user: T): Observable<HttpResponse<T>> {
        return this.http.post<T>(this.resourceUrl, user, { observe: 'response' });
    }

    public update(user: T): Observable<HttpResponse<T>> {
        return this.http.put<T>(this.resourceUrl, user, { observe: 'response' });
    }

    public enable2FA(userKey: string, email: string): Observable<HttpResponse<any>> {
        return this.http.post(`${this.resourceUrl}/${userKey}/tfa_enable`, {
            otpChannelSpec: {
                channelType: 'email',
                destination: email,
            },
        }, { observe: 'response' });
    }

    public disable2FA(userKey: string): Observable<HttpResponse<any>> {
        return this.http.post(`${this.resourceUrl}/${userKey}/tfa_disable`, {}, { observe: 'response' });
    }

    public find(userKey: string): Observable<T> {
        return this.http.get<T>(`${this.resourceUrl}/${userKey}`);
    }

    public loginContains(req: any): Observable<any> {
        let params = new HttpParams();
        if (req) {
            params = params.set('page', req.page);
            params = params.set('size', req.size);
            if (req.sort) {
                req.sort.forEach((val) => {
                    params = params.append('sort', val);
                });
            }
            if (req.login) {
                params = params.set('login', req.login);
            }
        }

        return this.http.get(this.resourceUrlByLogin, { params, observe: 'response' });
    }

    public findPublic(userKey: string): Observable<T> {
        return this.http.get<T>(`${this.resourceUrl}/${userKey}/public`, { headers: SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS });
    }

    public getByUserKeys(userKeys: string[]): Observable<T[]> {
        const unique = _.uniq(userKeys);
        const obs = _.map<string, Observable<T>>(unique, (i) => this.findPublic(i));
        return zip(...obs);
    }

    public findByLogin(login: string): Observable<HttpResponse<T>> {
        let params = new HttpParams();
        params = params.set('login', login);
        return this.http.get<T>(`${this.resourceUrl}/logins`, { params, observe: 'response' });
    }

    public query(req?: any): Observable<HttpResponse<T[]>> {
        let params = new HttpParams();
        if (req) {
            params = params.set('page', req.page);
            params = params.set('size', req.size);
            if (req.sort) {
                req.sort.forEach((val) => {
                    params = params.append('sort', val);
                });
            }
            if (req.roleKey) {
                params = params.set('roleKey', req.roleKey);
            }
        }

        return this.http.get<T[]>(this.resourceUrl, { params, observe: 'response' });
    }

    public delete(userKey: string): Observable<HttpResponse<any>> {
        return this.http.delete(`${this.resourceUrl}/${userKey}`, { observe: 'response' });
    }

    public updateLogins(user: T): Observable<HttpResponse<T>> {
        return this.http.put<T>(`${this.resourceUrl}/logins`, user, { observe: 'response' });
    }

    public getOnlineUsers(): Observable<HttpResponse<T>> {
        return this.http.get<T>('uaa/api/onlineUsers', { observe: 'response' });
    }


    public unblock(user: { userKey?: string | number }): Observable<void> {
        return this.http.put<void>(`/uaa/api/users/${user.userKey}/activate`, null);
    }

    public block(user: { userKey?: string | number }): Observable<void> {
        return this.http.put<void>(`/uaa/api/users/${user.userKey}/block`, null);
    }
}
