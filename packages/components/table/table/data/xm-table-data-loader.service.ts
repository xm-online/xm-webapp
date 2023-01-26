import { Injectable } from '@angular/core';
import { ArgumentException, NotSupportedException } from '@xm-ngx/shared/exceptions';
import { Observable, of, switchMap } from 'rxjs';
import { XmTableDataSource } from '../interfaces/xm-table.model';
import { XmDynamicServiceLoader } from './xm-dynamic-service-loader.service';
import { XmTableFilterController } from '../controllers/filters/xm-table-filter-controller.service';

export interface XmTableDataSourceI<T> {
    loading$: Observable<boolean>;
    query: (query: object, config: XmTableDataSource) => Observable<T[]>;
}

// "currentQuery": "typeKey:\"GROUP-MEMBER\"",

@Injectable({ providedIn: 'any' })
export class XmTableDataLoaderService<P> {
    private dataManagerServiceRef: XmTableDataSourceI<P>;
    private _loading$: Observable<boolean> = of(false);

    constructor(private dynamicLoader: XmDynamicServiceLoader,
                private requestBuilderService: XmTableFilterController) {
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
            switchMap(query => this.dataManagerServiceRef.query(query, dataSource)),
        );
    }

    public loading$(): Observable<boolean> {
        return this._loading$;
    }

}
