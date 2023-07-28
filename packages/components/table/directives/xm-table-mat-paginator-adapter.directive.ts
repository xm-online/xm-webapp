import { AfterViewInit, Directive, OnDestroy, Self } from '@angular/core';
import { XmTableDirective } from './xm-table.directive';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { MatPaginator } from '@angular/material/paginator';

@Directive({
    selector: '[xmTableMatPaginatorAdapter]',
    exportAs: 'xmTableMatPaginatorAdapter',
    providers: [],
    standalone: true,
})
export class XmTableMatPaginatorAdapterDirective implements AfterViewInit, OnDestroy {
    constructor(
        @Self() private matPaginator: MatPaginator,
        private xmTableDirective: XmTableDirective,
    ) {
    }

    public ngAfterViewInit(): void {
        this.observeTableAndUpdateMatPaginator();
    }

    public observeTableAndUpdateMatPaginator(): void {
        this.xmTableDirective.context$
            .pipe(takeUntilOnDestroy(this))
            .subscribe((context) => {
                this.matPaginator.pageIndex = context.collection.pageableAndSortable.pageIndex;
                this.matPaginator.length = context.collection.pageableAndSortable.total;
                this.matPaginator.pageSize = context.collection.pageableAndSortable.pageSize;
            });
        this.matPaginator.page
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => this.xmTableDirective.updatePagination());
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
