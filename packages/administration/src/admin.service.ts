import { HttpHeaders } from "@angular/common/http";
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

@Injectable()
export class BaseAdminListComponent implements OnInit, OnDestroy {

    public list: any[];
    public page: number = 1;
    public previousPage: number;
    public reverse: boolean;
    public predicate: string = 'id';
    public itemsPerPage: number;
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
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.itemsPerPage = data?.pagingParams?.size;
            this.page = data?.pagingParams?.page;
            this.previousPage = data?.pagingParams?.page;
            this.reverse = data?.pagingParams?.ascending;
            this.predicate = data?.pagingParams?.predicate;
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
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== this.basePredicate) {
            result.push(this.basePredicate);
        }
        return result;
    }

    public transition(): void {
        this.router.navigate([this.navigateUrl], {
            queryParams:
                {
                    size: this.itemsPerPage,
                    page: this.page,
                    sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
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

    public onSuccess(data: Array<{id: number}>, headers: HttpHeaders): Array<{id: number}> {
        const uniqueData = _.uniqBy(data, (e) => e.id);
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = uniqueData.length;
        this.queryCount = this.totalItems;
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
            const length = parseInt((this.queryCount / this.itemsPerPage) + '', 10)
                + (this.queryCount % this.itemsPerPage ? 1 : 0);
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
