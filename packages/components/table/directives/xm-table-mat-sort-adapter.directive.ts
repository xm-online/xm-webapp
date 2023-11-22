import { AfterViewInit, Directive, OnDestroy, Self } from '@angular/core';
import { MatSort, SortDirection } from '@angular/material/sort';
import { XmTableDirective } from './xm-table.directive';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { take } from 'rxjs/operators';

@Directive({
    selector: '[xmTableMatSortAdapter]',
    exportAs: 'xmTableMatSortAdapter',
    providers: [],
    standalone: true,
})
export class XmTableMatSortAdapterDirective implements AfterViewInit, OnDestroy {

    constructor(
        @Self() private matSort: MatSort,
        private xmTableDirective: XmTableDirective,
    ) {
    }

    public ngAfterViewInit(): void {
        this.observeSortChanges();
        this.observeTableAndUpdateMatSort();
    }



    public observeTableAndUpdateMatSort(): void {
        this.xmTableDirective.context$
            .pipe(takeUntilOnDestroy(this),take(1))
            .subscribe((context) => {
                const sortBy=context.collection.pageableAndSortable.sortBy as string;
                const sortOrder =context.collection.pageableAndSortable.sortOrder;
                if(this.isSortChanged(sortBy,sortOrder)) {
                    return;
                }
                this.updateMatSort(sortBy,sortOrder);
            });

    }

    private updateMatSort(sortBy: string, sortOrder: SortDirection): void {
        this.matSort.sort({ id: sortBy, start: sortOrder, disableClear: true });
    }

    private isSortChanged(sortBy: string, sortOrder: SortDirection): boolean {
        return this.matSort.active === sortBy && this.matSort.direction === sortOrder;
    }

    private observeSortChanges(): void {
        this.matSort.sortChange
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => this.xmTableDirective.updatePagination());
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}

