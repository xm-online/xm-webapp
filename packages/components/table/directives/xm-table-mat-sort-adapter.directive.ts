import { AfterViewInit, Directive, OnDestroy, Self } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { XmTableDirective } from '@xm-ngx/components/table';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';

@Directive({
    selector: '[xmTableMatSortAdapter]',
    exportAs: 'xmTableMatSortAdapter',
    providers: [],
    standalone: true,
})
export class XmTableMatSortAdapterDirective implements AfterViewInit, OnDestroy {

    constructor(
        @Self() private matSort: MatSort,
        @Self() private xmTableDirective: XmTableDirective,
    ) {
    }

    public ngAfterViewInit(): void {
        this.xmTableDirective.context$
            .pipe(takeUntilOnDestroy(this))
            .subscribe((context) => {
                this.matSort.active = context.collection.pageableAndSortable.sortBy as string;
                this.matSort.direction = context.collection.pageableAndSortable.sortOrder;
            })
        this.matSort.sortChange
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => this.xmTableDirective.updatePagination());
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
