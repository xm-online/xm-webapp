import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';
import { debounceTime, distinctUntilChanged, filter, finalize, map, takeUntil, tap } from 'rxjs/operators';

import { XmEntitySpec } from '../index';
import { LinkSpec } from '../shared/link-spec.model';
import { Link } from '../shared/link.model';
import { LinkService } from '../shared/link.service';
import { Spec } from '../shared/spec.model';
import { XmEntity } from '../shared/xm-entity.model';
import { fromEvent, ReplaySubject } from 'rxjs';
import { XmConfigService } from '../../shared';

declare let swal: any;

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
    @ViewChild('searchField', {static: false}) public searchField: ElementRef;

    public xmEntity: XmEntity = {};
    public searchQuery: string;
    public searchXmEntities: XmEntity[];
    public total: number;
    public showLoader: boolean;
    private page: number;
    private linkSpecQuery: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private activeModal: NgbActiveModal,
                private linkService: LinkService,
                private eventManager: JhiEventManager,
                private translateService: TranslateService,
                private configService: XmConfigService) {
    }

    public ngOnInit(): void {
        this.getLinkSpecConfig().subscribe((res) => this.linkSpecQuery = res || null);
        this.onSearch();
    }

    public ngAfterViewInit(): void {
        fromEvent(this.searchField.nativeElement,'keyup')
            .pipe(
                filter(Boolean),
                debounceTime(DEBOUNCE_DELAY),
                distinctUntilChanged<any>(),
                takeUntil(this.destroyed$),
                tap(() => {
                    this.searchQuery = this.searchField.nativeElement.value;
                    this.onSearch();
                }),
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getEntitySpec(typeKey: string): XmEntitySpec {
        return this.spec.types.filter((t) => t.key === typeKey).shift();
    }

    public onShowMore(): void {
        this.page++;
        this.load();
    }

    public onCancel(): void {
        this.activeModal.dismiss('cancel');
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
                this.alert('success', 'xm-entity.link-detail-dialog.add.success');
            }, () => {
                this.alert('error', 'xm-entity.link-detail-dialog.add.error');
                this.showLoader = false;
            },
            () => this.activeModal.dismiss(true));
    }

    public onSearch(): void {
        this.searchXmEntities = [];
        this.page = 0;
        this.load();
    }

    private load(): void {
        this.showLoader = true;
        const options = {
            query: this.getLinkSearchQuery(),
            size: 5,
            page: this.page,
        };
        this.linkService
            .searchLinks(this.sourceXmEntity.typeKey, this.sourceXmEntity.id, this.linkSpec.key, options)
            .pipe(
                takeUntil(this.destroyed$),
                finalize(() => this.showLoader = false),
            )
            .subscribe((res: HttpResponse<Link[]>) => {
                const xmEntities = (res && res.body) || [];
                this.total = parseInt(res.headers.get('X-Total-Count'), 10);
                this.searchXmEntities.push(...xmEntities);
            }, (err) => console.info(err)); // tslint:disable-line;
    }

    private getLinkSpecConfig(): any {
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

    private alert(type: string, key: string): void {
        swal({
            type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary',
        });
    }

}
