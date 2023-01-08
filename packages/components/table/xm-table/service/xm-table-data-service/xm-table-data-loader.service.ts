import { Injectable } from '@angular/core';
import { DynamicServiceLoader } from '@xm-ngx/components/table/xm-table/service/dynamic-service-loader';
import { XmRequestBuilderService } from '@xm-ngx/components/table/xm-table/service/xm-request-builder-service/xm-request-builder.service';
import { XmTableDataSource } from '@xm-ngx/components/table/xm-table/xm-table.model';
import { ArgumentException, NotSupportedException } from '@xm-ngx/shared/exceptions';
import { Observable, of, switchMap } from 'rxjs';

export interface XmTableDataSourceI<T> {
    loading$: Observable<boolean>;
    getAll: (query: object, config: XmTableDataSource) => Observable<T[]>;
}

@Injectable({ providedIn: 'any' })
export class XmTableDataLoaderService<P> {
    private dataManagerServiceRef: XmTableDataSourceI<P>;
    private _loading$: Observable<boolean> = of(false);

    constructor(private dynamicLoader: DynamicServiceLoader,
                private requestBuilderService: XmRequestBuilderService) {
    }

    public getDataManagerService(): XmTableDataSourceI<P> {
        if (!this.dataManagerServiceRef) {
            throw new NotSupportedException('Service did not initialize. Call getData first!');
        }
        return this.dataManagerServiceRef;
    }

    //should call once
    public getData(dataSource: XmTableDataSource): Observable<P[]> {
        this.dataManagerServiceRef = this.dynamicLoader.getService(dataSource.type);
        if (!this.dataManagerServiceRef) {
            throw new ArgumentException('Can`t find DataSourceService!');
        }
        this._loading$ = this.dataManagerServiceRef.loading$;
        return this.requestBuilderService.change$().pipe(

            switchMap(query => this.dataManagerServiceRef.getAll(query, dataSource)),
        );
    }

    public loading$(): Observable<boolean> {
        return this._loading$;
    }

}
