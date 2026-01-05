import { Component, inject, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { XmTableSelectionService } from '../../controllers/selections/xm-table-selection.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
    XM_DYNAMIC_COMPONENT_CONFIG,
    XmDynamicInstanceService,
    XmDynamicLayout,
    XmDynamicModule,
} from '@xm-ngx/dynamic';
import { finalize, map } from 'rxjs/operators';
import { Defaults, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, Subscription, switchMap, take } from 'rxjs';
import { XmEntity } from '@xm-ngx/core/entity';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmTableQueryParamsStoreService } from '../../controllers/filters/xm-table-query-params-store.service';
import { TableHeaderSelection } from '../../animations/xm-table-widget.animation';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import { XmTableSelectionDefault, XmTableSelectionTranslates } from './xm-table-selection.model';
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
                    *ngIf="config.isMultiselect && (totalCount > selection.selected.length) && (config.selectAllWithoutLayouts || config.layout?.length)"
                    [xm-loading]="loading"
                    class="total-count"
                    mat-button
                    (click)="onAllSelected()">
                    {{xmTableSelectionTranslates.allItems | xmTranslate}} {{totalCount}}
                </button>
            </ng-container>

            <div *ngIf="layout?.length" class="ms-auto">
                <ng-container *ngIf="config.menuMode; else default">
                    <mat-menu #actions class="selection-menu">
                        <div xmDynamicPresentation
                             *ngFor="let item of layout"
                             [class]="item.class"
                             [style]="item.style"
                             [selector]="item.selector"
                             [value]="selection.selected"
                             [options]="item.options"
                             [config]="item.config"
                             [controllers]="item['controllers']"
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
                                  *ngFor="let item of layout"
                                  [class]="item.class"
                                  [style]="item.style"
                                  [selector]="item.selector"
                                  [value]="selection.selected"
                                  [options]="item.options"
                                  [config]="item.config"
                                  [controllers]="item['controllers']">
                    </ng-container>
                </ng-template>
            </div>
        </div>
    `,
    standalone: true,
    styleUrls: ['./xm-table-selection-header.component.scss'],
    animations: [
        TableHeaderSelection,
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
        XmTranslatePipe,
    ],
})
export class XmTableSelectionHeaderComponent<T> implements OnInit, OnDestroy {
    @Defaults(XmTableSelectionDefault)
    @Input() public config: XmTableSelectionConfig = inject<XmTableSelectionConfig>(XM_DYNAMIC_COMPONENT_CONFIG);
    @Input() public defaultCollectionController: any;

    public selection: SelectionModel<unknown>;
    public isVisible$: Observable<boolean>;
    public totalCount$: Observable<number>;
    public loading: boolean = false;
    public xmTableSelectionTranslates = XmTableSelectionTranslates;
    public layout: XmDynamicLayout[];
    private cancelSelectionRequests$: Subscription;

    private xmDynamicInstanceService: XmDynamicInstanceService = inject(XmDynamicInstanceService);
    private injector: Injector = inject(Injector);
    private get collectionController(): any {
        const configCollectionCtrl = this.xmDynamicInstanceService.getControllerByKey(
            this.config.controller?.key,
            this.injector
        );

        // Config in priority,
        // If we dont have config for selection try to use table collection
        if (configCollectionCtrl == null) {
            return this.defaultCollectionController;
        }

        return configCollectionCtrl;
    }

    private selectionService: XmTableSelectionService<unknown> = inject(XmTableSelectionService);
    private xmTableQueryParamsStoreService = inject(XmTableQueryParamsStoreService);

    public ngOnInit(): void {
        const isMultiselect = this.config.isMultiselect;

        if (this.config.useMultipleSelectionModels) {
            this.selection = this.selectionService.getSelectionModel(this.config.key, isMultiselect);
        } else {
            if (this.selectionService.selection.isMultipleSelection() !== isMultiselect) {
                const currentSelection = this.selectionService.selection.selected;
                this.selectionService.selection = new SelectionModel(isMultiselect, isMultiselect ? currentSelection : currentSelection.slice(0, 1));
            }
            this.selection = this.selectionService.selection;
        }

        this.totalCount$ = this.collectionController.state$()
            .pipe(
                map((res: QueryParamsPageable) => res.pageableAndSortable?.total)
            );
        this.isVisible$ = this.selection.changed
            .pipe(
                map((select) => !select.source.isEmpty()),
            );

        this.layout = this.config.layout?.map((item: any) => {
            const config = item['config'] || item['options'] || {};
            _.set(item, 'config.selectionKey', config.selectionKey || this.config.key);
            _.set(item, 'options.selectionKey', config.selectionKey || this.config.key);
            return item;
        });
    }

    public selections$(): Observable<SelectionModel<XmEntity>> {
        return this.selectionService.get(this.config?.key);
    }

    public onAllSelected(): void {
        this.loading = true;
        this.cancelSelectionRequests$ = this.selections$()
            .pipe(
                take(1),
                switchMap(() => {
                    const params = _.merge(this.xmTableQueryParamsStoreService.getQueryParamsValue(), {
                        pageableAndSortable: {pageSize: this.config.pageSize, pageIndex: 0},
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
        this.cancelSelectionRequests$?.unsubscribe();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
