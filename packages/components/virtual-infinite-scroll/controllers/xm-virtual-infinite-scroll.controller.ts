import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { XM_DYNAMIC_COMPONENT_CONFIG } from '@xm-ngx/dynamic';
import { Observable } from 'rxjs';
import {
    VirtualInfiniteScrollController,
    VirtualInfiniteScrollControllerConfig, VirtualInfiniteScrollWidgetResponse,
} from '../xm-virtual-infinity-scroll.models';
import { ActivatedRoute } from '@angular/router';
import { interpolate } from '@xm-ngx/operators';
import { map } from 'rxjs/operators';

@Injectable()
export class XmVirtualInfiniteScrollController<T> implements VirtualInfiniteScrollController<T> {
    protected config: VirtualInfiniteScrollControllerConfig = inject<VirtualInfiniteScrollControllerConfig>(XM_DYNAMIC_COMPONENT_CONFIG);
    protected httpClient: HttpClient = inject(HttpClient);
    protected activatedRoute: ActivatedRoute = inject(ActivatedRoute);

    public request<T>(): Observable<VirtualInfiniteScrollWidgetResponse<T>> {
        const {
            url,
            method,
            params,
            headers,
            body = {}
        } = this.config.request;

        return this.httpClient.request<T>(
            method,
            interpolate(url, this.activatedRoute.snapshot.queryParams),
            {
                body,
                params,
                headers,
                observe: 'response',
            }
        ).pipe(map(this.mapResponse));
    }

    private mapResponse<T>(response: HttpResponse<T>): VirtualInfiniteScrollWidgetResponse<T> {
        const { body, headers } = response;
        console.log(headers);
        return {
            items: body,
            total: 1000 // Number(headers.get('X-Total-Count'))
        }
    }
}
