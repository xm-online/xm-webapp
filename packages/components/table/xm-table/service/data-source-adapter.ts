import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TableDataSourceI<T> {
    data: any
    connect: () => BehaviorSubject<T[]>;
    disconnect: () => void;
    sort: MatSort | null;
    paginator: MatPaginator;
}

export class DataSourceAdapter<T> implements TableDataSourceI<T> {
    get data(): () => T[] {
        return this.source.data;
    }


    public connect: () => BehaviorSubject<T[]>;
    public disconnect: () => void;
    public loading$: Observable<boolean>;

    constructor(private source: MatTableDataSource<T> | TableDataSourceI<T>) {

        this.paginator = source.paginator;


        this.connect = () => source.connect();
        this.disconnect = () => source.disconnect();
        if (source.hasOwnProperty('loading$')) {
            this.loading$ = (source as unknown as any).loading$;
        } else {
            this.loading$ = new BehaviorSubject(false).asObservable();
        }
    }

    public get sort(): MatSort | null {
        return this.source.sort;
    }

    public set sort(value: MatSort | null) {
        this.source.sort = value;
    }

    public get paginator(): MatPaginator {
        return this.source.paginator;
    }

    public set paginator(value: MatPaginator) {
        this.source.paginator = value;
    }


}
