import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    NgZone,
    OnDestroy,
    Output,
    ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { injectByKey, XM_DYNAMIC_COMPONENT_CONFIG } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { defaultsDeep } from 'lodash';
import { merge, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TableExpand } from '../animations/xm-table-widget.animation';
import {
    IXmTableCollectionController,
    XM_TABLE_CONTROLLERS,
    XmTableCollectionControllerResolver,
} from '../collections';
import { XmTableColumnsSettingStorageService } from '../controllers/config/xm-table-columns-setting-storage.service';
import { XmTableColumnDynamicCellComponent } from '../columns/xm-table-column-dynamic-cell.component';
import { XmTableSelectionHeaderComponent } from '../components/selection-header/xm-table-selection-header.component';
import { XmTableEmptyComponent } from '../components/xm-table-empty.component';
import { XmTableExpandPanelButtonComponent } from '../components/xm-table-expand-panel-button.component';
import { XmTableFilterButtonComponent } from '../components/xm-table-filter-button.component';
import { XmTableFilterChipsComponent } from '../components/xm-table-filter-chips.component';
import { XmTableFilterInlineComponent } from '../components/xm-table-filter-inline.component';
import { XmTableHeaderComponent } from '../components/xm-table-header.component';
import { XmTableLoadingComponent } from '../components/xm-table-loading.component';
import { XmTableQuickFilterInlineComponent } from '../components/xm-table-quick-filter-inline.component';
import { XmTableSelectionColumnComponent } from '../components/xm-table-selection-column.component';
import { XmTableMatPaginatorAdapterDirective } from '../directives/xm-table-mat-paginator-adapter.directive';
import { XmTableMatSortAdapterDirective } from '../directives/xm-table-mat-sort-adapter.directive';
import { XmTableSelectionDirective } from '../directives/xm-table-selection.directive';
import { XmTableDirective } from '../directives/xm-table.directive';
import { XM_TABLE_CONFIG_DEFAULT } from '../directives/xm-table.model';
import { XmTableMatPaginatorInt } from './table.mat-paginator-int';
import { XM_TABLE_WIDGET_CONFIG_DEFAULT, XmTableWidgetConfig } from './xm-table-widget.config';
import { XmTableSelectionDefault } from '../components/selection-header/xm-table-selection.model';
import { XmTableUserSelectionColumnComponent } from '../components/xm-table-user-selection-column.component';
import { XmRowHighlightTableDirective } from '../directives/row-hightlight/xm-row-highlight-table.directive';
import { XmHighlightableRowDirective } from '../directives/row-hightlight/xm-highlightable-row.directive';

function getConfig(value: Partial<XmTableWidgetConfig>): XmTableWidgetConfig {
    const config = defaultsDeep({}, value, XM_TABLE_WIDGET_CONFIG_DEFAULT, XM_TABLE_CONFIG_DEFAULT) as XmTableWidgetConfig;
    config.columns.forEach(c => (c.name = c.name || c.field));
    config.pageableAndSortable.sortBy = config.pageableAndSortable.sortBy || config.columns[0].name;
    config.storageKey = config.storageKey || `${location.pathname}.xm-table-widget`;
    return config;
}

@Component({
    selector: 'xm-table-widget',
    templateUrl: './xm-table-widget.component.html',
    styleUrls: ['./xm-table-widget.component.scss'],
    standalone: true,
    host: {class: 'xm-table-widget'},
    imports: [
        MatCardModule,
        NgIf,
        XmTableDirective,
        XmTableFilterButtonComponent,
        XmTableFilterChipsComponent,
        XmTableSelectionHeaderComponent,
        XmTableSelectionDirective,
        MatPaginatorModule,
        XmTableEmptyComponent,
        MatTableModule,
        MatSortModule,
        AsyncPipe,
        XmTableColumnDynamicCellComponent,
        NgForOf,
        XmTableSelectionColumnComponent,
        NgClass,
        XmTableHeaderComponent,
        XmTableMatPaginatorAdapterDirective,
        XmTableMatSortAdapterDirective,
        XmTableLoadingComponent,
        XmTableExpandPanelButtonComponent,
        XmTableFilterInlineComponent,
        XmTableQuickFilterInlineComponent,
        XmTableUserSelectionColumnComponent,
        XmRowHighlightTableDirective,
        XmHighlightableRowDirective,
    ],
    providers: [
        ...XM_TABLE_CONTROLLERS,
        {
            provide: MatPaginatorIntl,
            useClass: XmTableMatPaginatorInt,
        },
        {
            provide: XM_DYNAMIC_COMPONENT_CONFIG,
            useValue: XmTableSelectionDefault,
        },
    ],
    animations: [
        TableExpand,
    ],
})
export class XmTableWidget implements AfterViewInit, OnDestroy {

    @ViewChild('table', {read: ElementRef}) public tableRef: ElementRef;
    @ViewChild(MatTable) public table: MatTable<any>;
    @Output() public rowClicked = new EventEmitter<unknown>();
    private collectionController: IXmTableCollectionController<unknown> = injectByKey<IXmTableCollectionController<unknown>>('collection', {optional: true});
    private hasSticky: boolean = false;
    private zone = inject(NgZone);
    private resizeObserver: ResizeObserver;

    constructor(
        private collectionControllerResolver: XmTableCollectionControllerResolver,
        private tableColumnsSettingStorageService: XmTableColumnsSettingStorageService,
    ) {
    }

    private _config: XmTableWidgetConfig;

    public get config(): XmTableWidgetConfig {
        return this._config;
    }

    @Input()
    public set config(value: XmTableWidgetConfig) {
        this._config = getConfig(value);
        this.hasSticky = this.config.columns.some(column => column.sticky || column.stickyEnd);
    }

    public ngAfterViewInit(): void {
        this.observeTableResize();
    }

    private observeTableResize(): void {
        try {
            const {nativeElement} = this.tableRef || {};
            if (!nativeElement) {
                console.error('Table reference is not available for resize observer');
                return;
            }
            const subject = new Subject();
            this.resizeObserver = new ResizeObserver(() => {
                this.zone.run(() => {
                    subject.next(null);
                });
            });
            this.resizeObserver.observe(nativeElement);
            merge(this.tableColumnsSettingStorageService.getStore(), subject).pipe(
                takeUntilOnDestroy(this),
                debounceTime(50),
            ).subscribe(() => {
                if (this.hasSticky) {
                    this.table.updateStickyColumnStyles();
                }
            });
        } catch (e) {
            console.error('Can\'t run resize observer', e);
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
        if (this.tableRef?.nativeElement) this.resizeObserver?.unobserve(this.tableRef.nativeElement);
    }

    public getCollectionController(): IXmTableCollectionController<unknown> {
        return this.collectionController || this.collectionControllerResolver.factory(this.config.collection);
    }
}
