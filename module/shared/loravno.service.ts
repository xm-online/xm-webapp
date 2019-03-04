import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { XmEntityService } from '../../../../xm-entity';
import { FUNC_API_STATISTIC, FUNC_NAME_STATISTIC } from '../loravno.constants';
import { XmEntity } from '../../../../xm-entity/shared/xm-entity.model';
import { createRequestOption } from '../../../../shared/model/request-util';

declare let moment: any;

@Injectable()
export class LoravnoService {
    constructor(private http: HttpClient,
                private xmEntityService: XmEntityService) {
    }

    getUnits(options: any): Observable<any> {
        return this.xmEntityService.query(options);
    }

    sortByWeight(alerts: any): any {
        return alerts.sort((a: any, b: any) => {
            if (a.weight < b.weight) {
                return 1;
            }
            if (a.weight > b.weight) {
                return -1;
            }
            return 0;
        });
    }

    getAnalytic(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http.get<XmEntity>(
            `${FUNC_API_STATISTIC }${FUNC_NAME_STATISTIC}`,
            {params: options, observe: 'response'})
            .pipe(map((res: HttpResponse<XmEntity>) => this.convertResponse(res)));
    }

    getDateFromPeriod(period: number): string {
        return moment().subtract(period, 'd').format('YYYY-MM-DD');
    }

    private convert(inputContext: any): any {
        const copy = Object.assign({}, inputContext);
        return copy;
    }

    private convertItemFromServer(outputContext: any): any {
        const copy = Object.assign({}, outputContext);
        return copy;
    }

    private convertResponse(res: HttpResponse<any>): HttpResponse<any> {
        const body = this.convertItemFromServer(res.body);
        return res.clone({body});
    }
}
