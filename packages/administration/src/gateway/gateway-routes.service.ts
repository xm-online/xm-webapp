import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@xm-ngx/core/environment';
import { Observable } from 'rxjs';

import { GatewayRoute } from './gateway-route.model';

@Injectable()
export class GatewayRoutesService {
    constructor(private http: HttpClient) {
    }

    public findAll(): Observable<GatewayRoute[]> {
        return this.http.get<GatewayRoute[]>(`${environment.serverApiUrl}/api/gateway/routes/`);
    }
}
