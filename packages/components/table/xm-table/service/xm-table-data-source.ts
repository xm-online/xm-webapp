import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { IEntityCollection } from '@xm-ngx/components/entity-collection';
import { BehaviorSubject, combineLatest, map, merge, Observable, of, pluck, switchMap, tap } from 'rxjs';

export type PageableRequest = {
    page: number;
    size: number
}

export class TableDataSource implements DataSource<unknown>
//   MatTableDataSourcePaginator
{


    private renderData = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private readonly _filter = new BehaviorSubject<unknown>('');

    public loading$;
    private _renderChangesSubscription: any;

    get filter(): unknown {
        return this._filter.value;
    }

    set filter(filter: unknown) {
        this._filter.next(filter);
    }

    get sort(): MatSort | null {
        return this._sort;
    }

    set sort(sort: MatSort | null) {
        this._sort = sort;
        this._updateChangeSubscription();
    }

    private _sort: MatSort | null;

    get paginator(): MatPaginator | null {
        return this._paginator;
    }

    set paginator(paginator: MatPaginator | null) {
        this._paginator = paginator;
        this._updateChangeSubscription();
    }

    private _paginator: MatPaginator | null;

    private _data: unknown[] = [];

    get data(): unknown[] {
        return this._data;
    }

    set data(value: unknown[]) {
        this._data = value;
    }

    constructor(private entitiesService: IEntityCollection) {
        if (entitiesService.hasOwnProperty('loading$')) {
            this.loading$ = entitiesService.loading$;
        } else {
            this.loading$ = this.loadingSubject.asObservable();
        }
    }


    public connect(): BehaviorSubject<any[]> {
        return this.renderData;
    }

    public disconnect(): void {
        this.renderData.complete();
        this.loadingSubject.complete();
    }

    public load([query, sort, paginated]: [query: any, sort: any, paginated: any]): Observable<any[] & any> {
        return this.entitiesService.query({ ...query, ...sort, ...paginated }).pipe(
            pluck('body'),
        );

    }

    private _updateChangeSubscription() {
        const sortChange: Observable<Sort | null | void> = this._sort ?
            merge(this._sort.sortChange, this._sort.initialized) :
            of({
                active: '',
                direction: 'asc',
            });
        const pageChange: Observable<PageableRequest | null > = this._paginator ?
            merge(
                this._paginator.page,
                this._paginator.initialized,
            ).pipe(
                map((pageEvent) => {
                    if (pageEvent) {
                        return { page: pageEvent?.pageIndex, size: pageEvent?.pageSize };
                    }
                    return null;
                })) :
            of({
                page: 0,
                size: 5,
            });

        // Watch for base data or filter changes to provide a filtered set of data.
        const requestData = combineLatest(this._filter, sortChange, pageChange)
            .pipe(
                tap(() => this.loadingSubject.next(true)),
                switchMap((data) => this.load(data)),
                tap(() => this.loadingSubject.next(false)),
            );

        // Watched for paged data changes and send the result to the table to render.
        this._renderChangesSubscription?.unsubscribe();
        this._renderChangesSubscription = requestData.pipe(
            tap(res => {
                this._paginator && (this._paginator.length = res.total);
            }),
        ).subscribe(data => {
            this.data = data;
            this.renderData.next(data);
        });
    }
}
