import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Pageable } from '@xm-ngx/components/entity-collection';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class PaginatorParamsService {
    private page$: BehaviorSubject<Pageable> = new BehaviorSubject<Pageable>({
        pageIndex: 0,
        pageSize: 5,
    });

    public setPage(params: PageEvent): void {
        this.page$.next(this.convertToPageParams(params));
    }

    public paginationParams$(): Observable<Pageable> {
        return this.page$.asObservable();
    }

    private convertToPageParams(paginator: PageEvent) {
        const pageIndex = paginator.pageIndex;
        const pageSize = paginator.pageSize;
        const total = paginator.length;
        const pageable: Pageable = { pageIndex, pageSize, total };
        return pageable;
    }
}
