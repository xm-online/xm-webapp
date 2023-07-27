import { ContentChild, Directive, Input, OnInit } from '@angular/core';
import {
    IXmTableCollectionController,
    IXmTableCollectionState,
    XmTableColumnsSettingStorageService
} from '../controllers';
import { XmTableFilterController } from '../controllers/filters/xm-table-filter-controller.service';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { PageableAndSortable } from '@xm-ngx/repositories';
import * as _ from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { XmTableQueryParamsStoreService } from '../controllers/filters/xm-table-query-params-store.service';
import { XM_TABLE_CONFIG_DEFAULT, XmTableConfig } from './xm-table.model';
import { map } from 'rxjs/operators';
import { Defaults } from '@xm-ngx/operators';


export interface IXmTableContext {
    collection: IXmTableCollectionState<unknown>,
    settings: { displayedColumns: string [] };
}

@Directive({
    selector: '[xmTable]',
    exportAs: 'xmTable',
    providers: [],
    standalone: true,
})
export class XmTableDirective implements OnInit {
    public context$: Observable<IXmTableContext>;
    public pageableAndSortable$: ReplaySubject<PageableAndSortable> = new ReplaySubject<PageableAndSortable>(1);

    @ContentChild(MatPaginator, { static: false }) public paginator: MatPaginator | null;
    @ContentChild(MatSort, { static: false }) public sort: MatSort | null;

    @Input('xmTableController')
    public controller: IXmTableCollectionController<unknown>;

    @Input('xmTableConfig') @Defaults(XM_TABLE_CONFIG_DEFAULT)
    public config: XmTableConfig;

    constructor(
        private tableFilterController: XmTableFilterController,
        private columnsSettingStorageService: XmTableColumnsSettingStorageService,
        private queryParamsStoreService: XmTableQueryParamsStoreService,
    ) {
    }

    public async ngOnInit(): Promise<void> {
        this.context$ = combineLatest([
            this.controller.state$(),
            this.columnsSettingStorageService.getStore()
        ]).pipe(
            map(([state, a]) => {
                const displayedColumns = _.map(_.filter(a, i => !i.hidden), i => i.name);
                return ({
                    collection: state,
                    settings: { displayedColumns },
                });
            }),
        );

        combineLatest([
            this.tableFilterController.change$(),
            this.pageableAndSortable$,
        ])
            .subscribe(([filterParams, pageableAndSortable]) => {
                const queryParams = _.merge({}, { pageableAndSortable }, { filterParams });
                const removeFieldsFromUrl = Object.keys(this.config.queryParamsToFillter ?? {})
                    .reduce((acc, key) => ({ ...acc, [key]: null }), {});

                this.queryParamsStoreService.set(queryParams, removeFieldsFromUrl);

                this.controller.load(queryParams);
            });

        this.initQueryParams();
    }

    public updatePagination(): void {
        const sortBy = this.config.columns.find((i) => i.name === this.sort.active)?.name;
        const sortOrder = this.sort.direction;
        const pageIndex = this.paginator.pageIndex;
        const pageSize = this.paginator.pageSize;
        const total = this.paginator.length;
        const pageAndSort: PageableAndSortable = { pageIndex, pageSize, sortOrder, sortBy, total };
        this.pageableAndSortable$.next(pageAndSort);
    }

    private initQueryParams(): void {
        const queryParams = this.queryParamsStoreService.get(this.config.queryParamsToFillter);

        this.tableFilterController.set(queryParams.filterParams);
        const { pageIndex, pageSize, sortBy, sortOrder } = this.config.pageableAndSortable;
        const pageParams = {
            pageIndex,
            pageSize,
            sortBy,
            sortOrder,
        };
        this.pageableAndSortable$.next(_.merge({}, pageParams, queryParams.pageableAndSortable));
    }
}
