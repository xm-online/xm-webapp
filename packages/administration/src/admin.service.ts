import { HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { XmAlertService } from '@xm-ngx/alert';

import { ITEMS_PER_PAGE } from '@xm-ngx/components/pagination';
import { XmEventManager } from '@xm-ngx/core';
import { Link } from '@xm-ngx/entity';
import { XmToasterService } from '@xm-ngx/toaster';
import * as _ from 'lodash';
import { JhiParseLinks } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/shared';
import { XM_PAGE_SIZE_OPTIONS } from '../../../src/app/xm.constants';

@Injectable()
export class BaseAdminListComponent implements OnInit, OnDestroy {

    public options: {
        pageSizeOptions: number[],
        pageSize: number,
        sortDirection: 'asc' | 'desc',
        sortBy: string
    } = {
        pageSizeOptions: XM_PAGE_SIZE_OPTIONS,
        pageSize: ITEMS_PER_PAGE,
        sortDirection: 'desc',
        sortBy: 'id',
    };

    public list: any[];
    public page: number = 1;
    public previousPage: number;
    public links: Link[];
    public totalItems: number;
    public queryCount: number;
    public eventModify: string;
    public navigateUrl: string;
    public basePredicate: string;
    public showLoader: boolean;
    private routeData: Subscription;
    private eventModifySubscriber: Subscription;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected toasterService: XmToasterService,
        protected alertService: XmAlertService,
        protected eventManager: XmEventManager,
        protected parseLinks: JhiParseLinks,
        protected router: Router,
    ) {
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            if (data?.pagingParams) {
                this.options.pageSize = data.pagingParams.size || ITEMS_PER_PAGE;
                this.page = data.pagingParams.page;
                this.previousPage = data.pagingParams.page;
                this.options.sortDirection = data.pagingParams.ascending ? 'asc' : 'desc';
                this.options.sortBy = data.pagingParams.predicate || 'id';
            }
        });
    }

    public ngOnInit(): void {
        this.loadAll();
        this.registerChangeInList();
    }

    public ngOnDestroy(): void {
        this.routeData.unsubscribe();
        this.eventManager.destroy(this.eventModifySubscriber);
    }

    public loadAll(): void {
        throw new Error('Not implemented');
    }

    public deleteAction(id: number): void {
        throw new Error('Not implemented ' + id);
    }

    public sort(): string[] {
        const result = [this.options.sortBy + ',' + this.options.sortDirection];
        if (this.options.sortBy !== this.basePredicate) {
            result.push(this.basePredicate);
        }
        return result;
    }

    public transition(): void {
        this.router.navigate([this.navigateUrl], {
            queryParams:
                {
                    size: this.options.pageSize,
                    page: this.page,
                    sort: this.options.sortBy + ',' + this.options.sortDirection,
                },
        });
        this.loadAll();
    }

    public loadPage(page: number): void {
        this.page = page;
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    public registerChangeInList(): void {
        this.eventModifySubscriber = this.eventManager.subscribe(this.eventModify, (result) => {
            this.page = this.getPageAfterRemove(result);
            this.loadAll();
        });
    }

    public onSuccess(data: Array<Client>, headers: HttpHeaders): Array<Client> {
        const uniqueData = _.uniqBy(data, (e) => e.id);
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = +headers.get('x-total-count') || uniqueData.length;
        this.queryCount = uniqueData.length;
        return uniqueData;
    }

    public onError(error: any): void {
        this.toasterService.error(error.error, error.message, null);
    }

    protected onDeleteItem(id: number, itemName: string): void {
        this.alertService.open({
            title: `Delete ${itemName}?`,
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, delete!',
        }).subscribe((result) => result.value ? this.deleteAction(id) : console.info('Cancel'));
    }

    protected getPageAfterRemove(result: any): any {
        if (result && result.content && result.content.id === 'delete' && this.page > 1) {
            this.queryCount--;
            const length = parseInt((this.queryCount / this.options.pageSize) + '', 10)
                + (this.queryCount % this.options.pageSize ? 1 : 0);
            if (this.page > length) {
                this.previousPage = null;
                return length;
            }
            return this.page;
        } else {
            return this.page;
        }
    }

}
