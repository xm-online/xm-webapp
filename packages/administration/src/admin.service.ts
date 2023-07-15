import { HttpHeaders } from '@angular/common/http';
import { Directive, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { XmAlertService } from '@xm-ngx/alert';
import { QueryParamsPageable } from '@xm-ngx/components/entity-collection';

import { TABLE_CONFIG_DEFAULT } from '@xm-ngx/components/table';
import { XmTableColumn } from '@xm-ngx/components/table/columns/xm-table-column-dynamic-cell.component';
import { XmEventManager } from '@xm-ngx/core';
import { Link } from '@xm-ngx/entity';
import { XmToasterService } from '@xm-ngx/toaster';
import * as _ from 'lodash';
import { JhiParseLinks } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { Client } from '@xm-ngx/core/client';
import { NotImplementedException } from '@xm-ngx/shared/exceptions';

@Directive()
export class BaseAdminListComponent implements OnInit, OnDestroy {

    public config: {
        pageSizeOptions: number[],
        pageSize: number,
        sortDirection: 'asc' | 'desc',
        sortBy: string,
        navigateUrl: string[];
        columns?: XmTableColumn[]
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
        pageSize: this.config.pageSize,
        sortBy: this.config.sortBy,
        sortDirection: this.config.sortDirection,
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
            this.pagination.pageSize = data.pageSize || this.config.pageSize;
            this.pagination.pageIndex = data.pageIndex || 0;
            this.pagination.sortOrder = data.sortOrder || this.config.sortDirection;
            this.pagination.sortBy = data.sortBy || this.config.sortBy;
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
        const result = [this.config.sortBy + ',' + this.config.sortDirection];
        if (this.config.sortBy !== this.basePredicate) {
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

    public onError(error: {error: string, message: any}): void {
        this.toasterService.error(error.error, error.message, null);
    }

    protected updateRoute(): void {
        this.router.navigate(this.config.navigateUrl, {
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
            customClass: {
                confirmButton: 'btn mat-button btn-primary',
                cancelButton: 'btn mat-button',
            },
            confirmButtonText: 'Yes, delete!',
        }).subscribe((result) => result.value ? this.deleteAction(id) : console.info('Cancel'));
    }

    protected getPageAfterRemove(result: any): number {
        if (result && result.content && result.content.id === 'delete' && this.pagination.pageIndex > 1) {
            this.queryCount--;
            const length = parseInt((this.queryCount / this.config.pageSize) + '', 10)
                + (this.queryCount % this.config.pageSize ? 1 : 0);
            if (this.pagination.pageIndex > length) {
                this.previousPage = null;
                return length;
            }
            return this.pagination.pageIndex;
        }
        return this.pagination.pageIndex;

    }

}
