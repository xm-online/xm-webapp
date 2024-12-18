import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { injectByKey, XM_DYNAMIC_COMPONENT_CONFIG, } from '@xm-ngx/dynamic';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { isObservable, Observable } from 'rxjs';
import { ConditionDirective, ConditionModule } from '@xm-ngx/components/condition';
import { Defaults, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { ExportButtonConfig, XmTableExportButtonConfigDefault } from './xm-table-export-buttons.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import { XmTableQueryParamsStoreService } from '@xm-ngx/components/table';
import _ from 'lodash';

@Component({
    selector: 'xm-table-export-button',
    standalone: true,
    templateUrl: './xm-table-export-button.component.html',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        XmTranslationModule,
        XmPermissionModule,
        ConditionModule,
        XmLoadingModule,
        AsyncPipe,
    ],
})
export class XmTableExportButtonComponent {
    @Input() public value: any;
    @Defaults(XmTableExportButtonConfigDefault)
    @Input() public config = inject<ExportButtonConfig>(XM_DYNAMIC_COMPONENT_CONFIG);
    public loading$: Observable<boolean>;

    private controller = injectByKey<any>(this.config?.controller?.key, {optional: true});
    private loadingController = injectByKey<any>(this.config?.loadingController?.key, {optional: true});

    private xmTableQueryParamsStoreService = inject(XmTableQueryParamsStoreService);

    public ngOnInit(): void {
        this.loading$ = this.loadingController?.[this.config?.loadingController?.method]();
        if(this.controller) {
            this.controller.columns = this.config.columns?.filter(column => !column.hideExport);
        }
    }

    public executeControllerMethod(): void {
        const queryParams = _.merge(this.xmTableQueryParamsStoreService.getQueryParamsValue(), {
            pageableAndSortable: {pageSize: this.config.pageSize, pageIndex: 0}
        });

        if(this.controller?.[this.config.controller?.method]) {
            const executedMethod = this.controller[this.config.controller.method](queryParams, this.config.export);
            if (isObservable(executedMethod)) {
                executedMethod.pipe(
                    takeUntilOnDestroy(this),
                ).subscribe();
            }
            return;
        }
        console.warn('executeControllerMethod: method does not exist');
    }

    public disableButton(): boolean {
        if (this.config?.disableCondition) {
            return ConditionDirective.checkCondition(this.config.disableCondition, {data: this.value});
        }
        return false;
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
