import { AfterViewInit, Directive, Input, OnDestroy, Self } from '@angular/core';
import { XmTableDirective } from './xm-table.directive';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { MatPaginator } from '@angular/material/paginator';
import { XmTableWithColumnDynamicCellOptionsPagination } from '../table-widget/xm-table-widget.config';

@Directive({
    selector: '[xmTableMatPaginatorAdapter]',
    exportAs: 'xmTableMatPaginatorAdapter',
    providers: [],
    standalone: true,
})
export class XmTableMatPaginatorAdapterDirective implements AfterViewInit, OnDestroy {
    @Input() public config: XmTableWithColumnDynamicCellOptionsPagination;

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
                const {pageIndex, total, pageSize } = context.collection.pageableAndSortable || {};
                const infinityTotal = this.config?.infinityTotalLimit;
                this.matPaginator.pageIndex = pageIndex;
                this.matPaginator.length = total;
                this.matPaginator.pageSize = pageSize;
                this.matPaginator.showFirstLastButtons = !(infinityTotal && total >= infinityTotal);
            });
        this.matPaginator.page
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => this.xmTableDirective.updatePagination());
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
