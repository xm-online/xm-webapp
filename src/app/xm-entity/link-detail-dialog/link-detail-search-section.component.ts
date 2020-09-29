import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, tap } from 'rxjs/operators';

import { MatDialogRef } from '@angular/material/dialog';
import { XmEventManager } from '@xm-ngx/core';

import { XmToasterService } from '@xm-ngx/toaster';
import { UIConfig, XmConfigService } from '../../shared';
import { XmEntitySpec } from '../index';
import { LinkSpec } from '@xm-ngx/entity';
import { Link } from '@xm-ngx/entity';
import { LinkService } from '@xm-ngx/entity';
import { Spec } from '@xm-ngx/entity';
import { XmEntity } from '@xm-ngx/entity';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

const DEBOUNCE_DELAY = 500;

@Component({
    selector: 'xm-link-detail-search-section',
    templateUrl: './link-detail-search-section.component.html',
    styleUrls: ['./link-detail-search-section.component.scss'],
})
export class LinkDetailSearchSectionComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() public linkSpec: LinkSpec;
    @Input() public sourceXmEntity: XmEntity;
    @Input() public spec: Spec;
    @ViewChild('searchField') public searchField: ElementRef;

    public xmEntity: XmEntity = {};
    public searchQuery: string;
    public searchXmEntities: XmEntity[];
    public total: number;
    public showLoader: boolean;
    private page: number;
    private linkSpecQuery: any;

    constructor(private activeModal: MatDialogRef<LinkDetailSearchSectionComponent>,
                private linkService: LinkService,
                private eventManager: XmEventManager,
                private toasterService: XmToasterService,
                private configService: XmConfigService) {
    }

    public ngOnInit(): void {
        this.getLinkSpecConfig().subscribe((res) => this.linkSpecQuery = res || null);
        this.onSearch();
    }

    public ngAfterViewInit(): void {
        fromEvent(this.searchField.nativeElement, 'keyup')
            .pipe(
                filter(Boolean),
                debounceTime(DEBOUNCE_DELAY),
                distinctUntilChanged(),
                takeUntilOnDestroy(this),
                tap(() => {
                    this.searchQuery = this.searchField.nativeElement.value;
                    this.onSearch();
                }),
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public getEntitySpec(typeKey: string): XmEntitySpec {
        return this.spec.types.filter((t) => t.key === typeKey).shift();
    }

    public onShowMore(): void {
        this.page++;
        this.load();
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    public onAdd(targetXmEntity: XmEntity): void {
        this.showLoader = true;
        const link: Link = {};
        link.target = targetXmEntity;
        link.source = this.sourceXmEntity;
        link.typeKey = this.linkSpec.key;
        link.startDate = new Date().toISOString();

        this.linkService.create(link).subscribe(() => {
                this.eventManager.broadcast({name: 'linkListModification'});
                this.toasterService.success('xm-entity.link-detail-dialog.add.success');
            }, () => {
                this.toasterService.error('xm-entity.link-detail-dialog.add.error');
                this.showLoader = false;
            },
            () => this.activeModal.close(true));
    }

    public onSearch(): void {
        this.searchXmEntities = [];
        this.page = 0;
        this.load();
    }

    private load(): void {
        const options = {
            query: this.getLinkSearchQuery(),
            size: 5,
            page: this.page,
        };

        this.showLoader = true;
        this.linkService
            .searchLinks(this.sourceXmEntity.typeKey, this.sourceXmEntity.id, this.linkSpec.key, options)
            .pipe(
                takeUntilOnDestroy(this),
                finalize(() => this.showLoader = false),
            )
            .subscribe((res: HttpResponse<Link[]>) => {
                const xmEntities = res?.body || [];

                this.total = parseInt(res.headers.get('X-Total-Count'), 10);
                this.searchXmEntities.push(...xmEntities);
            }, (err) => console.info(err));
    }

    private getLinkSpecConfig(): Observable<UIConfig> {
        return this.configService.getUiConfig().pipe(
            map((res) => res.applications.config.entities
                .find((entity) => entity.typeKey === this.sourceXmEntity.typeKey) || {}),
            filter((entity) => entity.hasOwnProperty('links')),
            map((entity) => entity.links.find((link) => link.key === this.linkSpec.key).filterQuery),
        );
    }

    private getLinkSearchQuery(): string {
        return `(typeKey:${this.linkSpec.typeKey}* OR typeKey:${this.linkSpec.typeKey})`
            + (this.linkSpecQuery ? ` AND ${this.linkSpecQuery}` : '')
            + (this.searchQuery ? ` AND ${this.searchQuery}` : '');
    }

}
