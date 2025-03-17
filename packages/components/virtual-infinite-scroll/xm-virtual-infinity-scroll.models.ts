import { HttpHeaders } from '@angular/common/http';
import { DataQa } from '@xm-ngx/interfaces';
import { Observable } from 'rxjs';

export interface VirtualInfiniteScrollController<T> {
    request: () => Observable<VirtualInfiniteScrollWidgetResponse<T>>
}

export interface VirtualInfiniteScrollWidgetConfig extends DataQa {
    itemSize: number;
    minBufferPx: number;
    maxBufferPx: number;
    controller: VirtualInfiniteScrollWidgetController;
    layout: any;
    theme: VirtualInfiniteScrollWidgetTheme;
}

export interface VirtualInfiniteScrollControllerConfig {
    request: VirtualInfiniteScrollRequest;
}

export interface VirtualInfiniteScrollRequest<BodyType = any> {
    url: string;
    method: string;
    body?: BodyType;
    headers?: HttpHeaders | Record<string, any>;
    params?: Record<string, string | number | boolean>;
}

export interface VirtualInfiniteScrollWidgetController {
    key: string;
    method: string;
}

export interface VirtualInfiniteScrollWidgetTheme {
    class: string;
    style: string;
}

export interface VirtualInfiniteScrollWidgetResponse<ItemsType = any[]> {
    items: ItemsType;
    total: number;
}
