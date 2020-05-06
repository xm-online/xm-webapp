import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@xm-ngx/core/environment';
import { Observable } from 'rxjs';

const SERVICES_COLLECTION = `${environment.serverApiUrl}/api/monitoring/services`;

@Injectable()
export class JhiMetricsService {

    constructor(private http: HttpClient) {
    }

    public getMetrics(msName: string = ''): Observable<any> {
        if (!msName) {
            return this.http.get(`${environment.serverApiUrl}/management/metrics`);
        } else {
            return this.http.get(`${environment.serverApiUrl}/${msName}/management/metrics`);
        }
    }

    public threadDump(): Observable<any> {
        return this.http.get(`${environment.serverApiUrl}/management/threaddump`);
    }

    public getMonitoringServicesCollection(): Observable<any> {
        return this.http.get(SERVICES_COLLECTION);
    }

    public getMetricsByMsName(msName: string, metricsType: string): Observable<any> {
        return this.http.get(`${environment.serverApiUrl}/api/monitoring/services/${msName}/${metricsType}`);
    }

    public isEmpty(obj: any): boolean {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
}
