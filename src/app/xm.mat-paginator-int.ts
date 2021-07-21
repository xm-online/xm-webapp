import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

type XmMatPaginatorIntGetRangeLabel = (page: number, pageSize: number, length: number) => string;

@Injectable()
export class XmMatPaginatorInt extends MatPaginatorIntl implements OnDestroy {

    public OF_LABEL: string = 'of';

    constructor(private translate: TranslateService) {
        super();

        this.translate.onLangChange
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => {
                this.getAndInitTranslations();
            });

        this.getAndInitTranslations();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public getAndInitTranslations(): void {
        this.translate.get([
            'mat.paginator.firstPageLabel',
            'mat.paginator.lastPageLabel',
            'mat.paginator.itemsPerPageLabel',
            'mat.paginator.nextPageLabel',
            'mat.paginator.previousPageLabel',
            'mat.paginator.of',
        ])
            .pipe(takeUntilOnDestroy(this))
            .subscribe(translation => {
                this.firstPageLabel = translation['mat.paginator.firstPageLabel'];
                this.lastPageLabel = translation['mat.paginator.lastPageLabel'];
                this.itemsPerPageLabel = translation['mat.paginator.itemsPerPageLabel'];
                this.nextPageLabel = translation['mat.paginator.nextPageLabel'];
                this.previousPageLabel = translation['mat.paginator.previousPageLabel'];
                this.OF_LABEL = translation['mat.paginator.of'];
                this.changes.next();
            });
    }

    public getRangeLabel: XmMatPaginatorIntGetRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return `0 ${this.OF_LABEL} ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} ${this.OF_LABEL} ${length}`;
    };
}

