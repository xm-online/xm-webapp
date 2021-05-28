import { HttpHeaders } from '@angular/common/http';
import { Directive, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { XmAlertService } from '@xm-ngx/alert';
import { QueryParamsPageable } from '@xm-ngx/components/entity-collection';

import { TABLE_CONFIG_DEFAULT } from '@xm-ngx/components/table';
import { XmEventManager } from '@xm-ngx/core';
import { Link } from '@xm-ngx/entity';
import { XmToasterService } from '@xm-ngx/toaster';
import * as _ from 'lodash';
import { JhiParseLinks } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/shared';
import { NotImplementedException } from '@xm-ngx/shared/exceptions';

@Directive()
export class BaseAdminListComponent implements OnInit, OnDestroy {

    public options: {
        pageSizeOptions: number[],
        pageSize: number,
        sortDirection: 'asc' | 'desc',
        sortBy: string,
        navigateUrl: string[];
    } = {
        pageSizeOptions: TABLE_CONFIG_DEFAULT.pageSizeOptions,
        pageSize: TABLE_CONFIG_DEFAULT.pageSize,
        sortDirection: 'desc',
        sortBy: 'id',
        navigateUrl: [],
    };
    public links: Link[];
    public totalItems: number;
    public queryCount: number;
    public eventModify: string;
    public basePredicate: string;
    public showLoader: boolean;
    public pagination: QueryParamsPageable = {
        pageIndex: 0,
        pageSize: this.options.pageSize,
        sortBy: this.options.sortBy,
        sortDirection: this.options.sortDirection,
    };
    private previousPage: number;
    private subscription: Subscription;
    private eventModifySubscriber: Subscription;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected toasterService: XmToasterService,
        protected alertService: XmAlertService,
        protected eventManager: XmEventManager,
        protected parseLinks: JhiParseLinks,
        protected router: Router,
    ) {
        this.subscription = this.activatedRoute.queryParams.subscribe((data: QueryParamsPageable) => {
            this.pagination.pageSize = data.pageSize || this.options.pageSize;
            this.pagination.pageIndex = data.pageIndex || 0;
            this.pagination.sortOrder = data.sortOrder || this.options.sortDirection;
            this.pagination.sortBy = data.sortBy || this.options.sortBy;
        });
    }

    public ngOnInit(): void {
        this.loadAll();
        this.registerChangeInList();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.eventModifySubscriber.unsubscribe();
    }

    public loadAll(): void {
        throw new NotImplementedException();
    }

    public deleteAction(id: number): void {
        throw new NotImplementedException();
    }

    public sort(): string[] {
        const result = [this.options.sortBy + ',' + this.options.sortDirection];
        if (this.options.sortBy !== this.basePredicate) {
            result.push(this.basePredicate);
        }
        return result;
    }

    public transition(): void {
        this.updateRoute();
        this.loadAll();
    }

    public loadPage(page: number): void {
        this.pagination.pageIndex = page;
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    public registerChangeInList(): void {
        this.eventModifySubscriber = this.eventManager.subscribe(this.eventModify, (result) => {
            this.pagination.pageIndex = this.getPageAfterRemove(result);
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

    protected updateRoute(): void {
        this.router.navigate(this.options.navigateUrl, {
            queryParams: {
                pageSize: this.pagination.pageSize,
                pageIndex: this.pagination.pageIndex,
                sortBy: this.pagination.sortBy,
                sortOrder: this.pagination.sortOrder,
            },
        });
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

    protected getPageAfterRemove(result: any): number {
        if (result && result.content && result.content.id === 'delete' && this.pagination.pageIndex > 1) {
            this.queryCount--;
            const length = parseInt((this.queryCount / this.options.pageSize) + '', 10)
                + (this.queryCount % this.options.pageSize ? 1 : 0);
            if (this.pagination.pageIndex > length) {
                this.previousPage = null;
                return length;
            }
            return this.pagination.pageIndex;
        } else {
            return this.pagination.pageIndex;
        }
    }

}
