import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@xm-ngx/core/environment';
import { Observable } from 'rxjs';

import { ChangePassword } from './password.model';

@Injectable()
export class Password {

    constructor(private http: HttpClient) {
    }

    public save(password: ChangePassword): Observable<any> {
        return this.http.post(`${environment.serverApiUrl}/uaa/api/account/change_password`, password);
    }
}
