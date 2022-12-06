import {Injectable, NgModuleRef} from '@angular/core';
import {TableDatasource} from '@xm-ngx/components/table/xm-table/xm-table.model';
import {ArgumentException} from '@xm-ngx/shared/exceptions';
import {Observable} from 'rxjs';


@Injectable()
export class DataService {
    public dataAccessService;

    constructor(private moduleRef: NgModuleRef<unknown>,) {
    }

    public getData(dataSource: TableDatasource): Observable<any[]> {
        this.dataAccessService = this.moduleRef.injector.get(dataSource.type, null);
        if (!this.dataAccessService) {
            throw new ArgumentException('Can`t find DataSourceService or it does not support!');
        }
        return this.dataAccessService.query(dataSource);
    }
}
