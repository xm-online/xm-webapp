import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@xm-ngx/core/environment';
import { Observable } from 'rxjs';

@Injectable()
export class RegisterService {

    constructor(private http: HttpClient) {
    }

    public save(account: any): Observable<any> {
        return this.http.post(`${environment.serverApiUrl}/uaa/api/register`, account);
    }

    public isCaptchaNeed(): Observable<any> {
        return this.http.get(`${environment.serverApiUrl}/uaa/api/is-captcha-need`);
    }

}
