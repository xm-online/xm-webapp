import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { SERVER_API_URL } from '../../../src/app/xm.constants';

const SERVICES_COLLECTION = '/api/monitoring/services';

@Injectable()
export class JhiMetricsService {

    constructor(private http: HttpClient) {}

    public getMetrics(msName: string = ''): Observable<any> {
        if (!msName) {
            return this.http.get( 'management/metrics');
        }
        return this.http.get( `/${msName}/management/metrics`);

    }

    public threadDump(): Observable<any> {
        return this.http.get( 'management/threaddump');
    }

    public getMonitoringServicesCollection(): Observable<any> {
        return this.http.get(SERVICES_COLLECTION);
    }

    public getMetricsByMsName(msName: string, metricsType: string): Observable<any> {
        return this.http.get(`/api/monitoring/services/${msName}/${metricsType}`);
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
