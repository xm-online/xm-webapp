import { AfterViewInit, Directive, OnDestroy, Self } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { XmTableDirective } from './xm-table.directive';
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
        private xmTableDirective: XmTableDirective,
    ) {
    }

    public ngAfterViewInit(): void {
        this.observeTableAndUpdateMatSort();
    }

    public observeTableAndUpdateMatSort(): void {
        this.matSort.sortChange
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => this.xmTableDirective.updatePagination(true));
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
