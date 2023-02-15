import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { createRequestOption } from '@xm-ngx/entity/shared/request-util';
import { XmEntity } from '@xm-ngx/entity/shared/xm-entity.model';

import { SERVER_API_URL } from '../../../../src/app/xm.constants';
import { ACCOUNT_TFA_DISABLE_URL, ACCOUNT_TFA_ENABLE_URL, ACCOUNT_URL } from '../../auth/src/auth.constants';
import { Account } from './account.model';

@Injectable({providedIn: 'root'})
export class AccountService {

    private resourceProfileUrl: string = SERVER_API_URL + 'entity/api/profile';
    private resourceLogins: string = SERVER_API_URL + 'uaa/api/account/logins';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    public get(): Observable<HttpResponse<any>> {
        return this.http.get<Account>(SERVER_API_URL + ACCOUNT_URL, {observe: 'response'});
    }

    public save(account: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + ACCOUNT_URL, account, {observe: 'response'});
    }

    public updateLogins(account: any): Observable<HttpResponse<any>> {
        return this.http.put(this.resourceLogins, account, {observe: 'response'});
    }

    public enableTFA(type: string, value: string): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + ACCOUNT_TFA_ENABLE_URL,
            {
                otpChannelSpec: {
                    channelType: type,
                    destination: value,
                },
            }, {observe: 'response'});
    }

    public disableTFA(): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + ACCOUNT_TFA_DISABLE_URL, {}, {observe: 'response'});
    }

    public getProfile(req?: any): Observable<XmEntity> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity>(this.resourceProfileUrl, {params: options, observe: 'response'}).pipe(
            map((res: HttpResponse<XmEntity>) => this.convertResponse(res)),
            map((res: HttpResponse<XmEntity>) => res.body),
        );
    }

    public resetPassword(mail: string): Observable<any> {
        return this.http.post('uaa/api/account/reset_password/init', mail);
    }

    public resetPasswordV2(login: string, loginType: string): Observable<any> {
        return this.http.post('uaa/api/account/reset_password/init', { login, loginType, resetType: 'EMAIL' });
    }

    private convertResponse(res: HttpResponse<XmEntity>): HttpResponse<XmEntity> {
        const body: XmEntity = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to XmEntity.
     */
    private convertItemFromServer(xmEntity: XmEntity): XmEntity {
        const copy: XmEntity = Object.assign({}, xmEntity);
        copy.startDate = this.dateUtils
            .convertDateTimeFromServer(xmEntity.startDate);
        copy.updateDate = this.dateUtils
            .convertDateTimeFromServer(xmEntity.updateDate);
        copy.endDate = this.dateUtils
            .convertDateTimeFromServer(xmEntity.endDate);
        return copy;
    }

}
