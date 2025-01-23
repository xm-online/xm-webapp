import { Component, inject, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { XmTableSelectionService, } from '../../controllers/selections/xm-table-selection.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { XM_DYNAMIC_COMPONENT_CONFIG, XmDynamicInstanceService, XmDynamicModule } from '@xm-ngx/dynamic';
import {
    finalize,
    map
} from 'rxjs/operators';
import {
    Defaults,
    takeUntilOnDestroy,
    takeUntilOnDestroyDestroy
} from '@xm-ngx/operators';
import { SelectionModel } from '@angular/cdk/collections';
import {
    Observable, switchMap,
    take
} from 'rxjs';
import { XmEntity } from '@xm-ngx/core/entity';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmTableQueryParamsStoreService } from '../../controllers/filters/xm-table-query-params-store.service';
import { TableHeaderSelection } from '../../animations/xm-table-widget.animation';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import {
    XmTableSelectionDefault,
    XmTableSelectionTranslates
} from './xm-table-selection.model';
import _ from 'lodash';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { QueryParamsPageable } from '@xm-ngx/repositories';
import { HttpResponse } from '@angular/common/http';
import { XmTableSelectionConfig } from '../../table-widget/xm-table-widget.config';

@Component({
    selector: 'xm-table-selection-header',
    template: `
        <div *ngIf="isVisible$ | async"
             @fadeInOut
             class="selection-header-container">

            <mat-icon class="close" (click)="clear()">close</mat-icon>

            <div class="selected-items-text">
                {{xmTableSelectionTranslates.selectedItems | xmTranslate}} {{selection?.selected?.length}}
            </div>

            <ng-container *ngIf="(totalCount$ | async) as totalCount">
                <button
                    *ngIf="(totalCount > selection.selected.length) && config.layout?.length"
                    [xm-loading]="loading"
                    class="total-count"
                    mat-button
                    (click)="onAllSelected()">
                    {{xmTableSelectionTranslates.allItems | xmTranslate}} {{totalCount}}
                </button>
            </ng-container>

            <div *ngIf="config.layout?.length" class="ms-auto">
                <ng-container *ngIf="config.menuMode; else default">
                    <mat-menu #actions class="selection-menu">
                        <div xmDynamicPresentation
                             *ngFor="let item of config.layout"
                             [class]="item.class"
                             [style]="item.style"
                             [selector]="item.selector"
                             [value]="getValue(item)"
                             [options]="item.options"
                             [config]="item.config"
                        >
                        </div>
                    </mat-menu>

                    <button [matMenuTriggerFor]="actions"
                            mat-icon-button>
                        <mat-icon>more_vert</mat-icon>
                    </button>
                </ng-container>

                <ng-template #default>
                    <ng-container xmDynamicPresentation
                                  *ngFor="let item of config.layout"
                                  [class]="item.class"
                                  [style]="item.style"
                                  [selector]="item.selector"
                                  [value]="getValue(item)"
                                  [options]="item.options"
                                  [config]="item.config">
                    </ng-container>
                </ng-template>
            </div>
        </div>
    `,
    standalone: true,
    styleUrls: ['./xm-table-selection-header.component.scss'],
    animations: [
        TableHeaderSelection
    ],
    imports: [
        MatButtonModule,
        MatMenuModule,
        NgForOf,
        NgIf,
        MatIconModule,
        XmDynamicModule,
        XmPermissionModule,
        AsyncPipe,
        XmLoadingModule,
        XmTranslatePipe
    ],
})
export class XmTableSelectionHeaderComponent<T> implements OnInit, OnDestroy {
    @Defaults(XmTableSelectionDefault)
    @Input() public config: XmTableSelectionConfig = inject<XmTableSelectionConfig>(XM_DYNAMIC_COMPONENT_CONFIG);
    public selection: SelectionModel<unknown>;
    public isVisible$: Observable<boolean>;
    public totalCount$: Observable<number>;
    public loading: boolean = false;
    public xmTableSelectionTranslates = XmTableSelectionTranslates;

    private xmDynamicInstanceService: XmDynamicInstanceService = inject(XmDynamicInstanceService);
    private injector: Injector = inject(Injector);
    private get collectionController(): any {
        return this.xmDynamicInstanceService.getControllerByKey(
            this.config.controller?.key,
            this.injector
        );
    }

    private selectionService: XmTableSelectionService<unknown> = inject(XmTableSelectionService);
    private xmTableQueryParamsStoreService = inject(XmTableQueryParamsStoreService);

    public ngOnInit(): void {
        this.selection = this.selectionService.selection;

        this.totalCount$ = this.collectionController.state$()
            .pipe(
                map((res: QueryParamsPageable) => res.pageableAndSortable?.total)
            );
        this.isVisible$ = this.selection.changed
            .pipe(
                map((select) => !select.source.isEmpty()),
            );
    }

    public getValue(item: T): SelectionModel<unknown> | unknown[] {
        const config = item['config'] || item['options'];
        return config?.valueAsSelection ? this.selection : this.selection.selected;
    }

    public selections$(): Observable<SelectionModel<XmEntity>> {
        return this.selectionService.get(this.config?.key);
    }

    public onAllSelected(): void {
        this.loading = true;
        this.selections$()
            .pipe(
                take(1),
                switchMap(() => {
                    const params = _.merge(this.xmTableQueryParamsStoreService.getQueryParamsValue(), {
                        pageableAndSortable: {pageSize: this.config.pageSize, pageIndex: 0}
                    });

                    return this.collectionController.repositoryController.getAll(params);
                }),
                finalize(() => this.loading = false),
                takeUntilOnDestroy(this),
            )
            .subscribe((res: HttpResponse<T[]> | any) => {
                this.selection.setSelection(...res['body']);
                this.selectionService.push(this.config?.key, this.selection);
            });
    }

    public clear(): void {
        this.selection.clear();
        takeUntilOnDestroyDestroy(this);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
