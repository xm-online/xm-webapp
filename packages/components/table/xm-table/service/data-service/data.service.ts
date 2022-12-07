import {Injectable, NgModuleRef} from '@angular/core';
import {TableDatasource} from '@xm-ngx/components/table/xm-table/xm-table.model';
import {ArgumentException, NotSupportedException} from '@xm-ngx/shared/exceptions';
import {Observable} from 'rxjs';

export interface XmTableDataSourceI<T> {
    loading$: () => Observable<boolean>;
    query: (config: TableDatasource) => Observable<T[]>;
}

@Injectable({providedIn: 'any'})
export class DataService<P> {
    private dataAccessService: XmTableDataSourceI<P>;
    private _loading$: Observable<boolean>;

    constructor(private moduleRef: NgModuleRef<unknown>) {
    }

    public getDataAccessService(): XmTableDataSourceI<P> {
        if (!this.dataAccessService) {
            throw new NotSupportedException('Service did not initialize. Call getData first!')
        }
        return this.dataAccessService;
    }

    //should call once
    public getData(dataSource: TableDatasource): Observable<P[]> {
        this.dataAccessService = this.moduleRef.injector.get(dataSource.type, null);
        if (!this.dataAccessService) {
            throw new ArgumentException('Can`t find DataSourceService!');
        }
        this._loading$ = this.dataAccessService.loading$();
        return this.dataAccessService.query(dataSource);
    }

    public loading$(): Observable<boolean> {
        return this._loading$;
    }

}
