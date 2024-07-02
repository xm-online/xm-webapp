import { AfterViewInit, Directive, inject, OnDestroy, Self } from '@angular/core';
import { XmTableDirective } from './xm-table.directive';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { MatPaginator } from '@angular/material/paginator';
import { XM_DYNAMIC_COMPONENT_CONFIG } from '@xm-ngx/dynamic';
import { XmTableWidgetConfig } from '../table-widget/xm-table-widget.config';

@Directive({
    selector: '[xmTableMatPaginatorAdapter]',
    exportAs: 'xmTableMatPaginatorAdapter',
    providers: [],
    standalone: true,
})
export class XmTableMatPaginatorAdapterDirective implements AfterViewInit, OnDestroy {
    public config = inject<XmTableWidgetConfig>(XM_DYNAMIC_COMPONENT_CONFIG);

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
                const infinityTotal = this.config?.pageableAndSortable?.infinityTotalLimit;
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
