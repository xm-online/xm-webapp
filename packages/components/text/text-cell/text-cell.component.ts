import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {
    XM_DYNAMIC_TABLE_ROW,
    XmDynamicPresentation,
} from '@xm-ngx/dynamic';
import { format, transformByMap } from '@xm-ngx/shared/operators';
import * as _ from 'lodash';

export interface XmTextCellConfig {
    path?: string;
    transformQueryParams: Record<string, string>;
    routerLink: string | string[];
    criteria?: Record<string, string>;
}

@Component({
    standalone: true,
    selector: 'xm-text-cell',
    template: `
        <ng-container *ngIf="data.routerLink; then link else text"></ng-container>

        <ng-template #link>
            <a
                [queryParams]="data.queryParams"
                [routerLink]="data.routerLink">
                <span *ngIf="data.view">{{ data.view }}</span>
            </a>
        </ng-template>

        <ng-template #text>
            {{ data.view }}
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
    ]
})
export class XmTextCellComponent implements OnInit, XmDynamicPresentation<unknown, XmTextCellConfig> {
    @Input() public value: unknown;

    private _config: XmTextCellConfig;

    @Input() 
    public set config(value: XmTextCellConfig) {
        this._config = _.defaults({}, value, {
            transformQueryParams: {'id': 'id'},
            routerLink: null,
        });
    }
    public get config(): XmTextCellConfig {
        return this._config;
    }
    
    private tableRowCtx = inject<any>(XM_DYNAMIC_TABLE_ROW, { optional: true });

    public data: {
        view: string;
        queryParams: Record<string, string>;
        routerLink: string[] | string;
    };

    public ngOnInit(): void {
        this.data = {
            view: this.extractValue(this.value),
            queryParams: transformByMap(this.getNestedObject(this.value), this.config.transformQueryParams),
            routerLink: this.config.routerLink,
        };
    }

    private searchKeyByPredicate(value: unknown): string {
        const { criteria } = this.config ?? {};

        if (_.isEmpty(criteria)) {
            return '-1';
        }

        if (_.isArray(value)) {
            const predicate = format(criteria, this.tableRowCtx ?? {});

            if (_.isEmpty(predicate) == false) {
                return `${_.findIndex(value, predicate)}`;
            }
        }

        return '-1';
    }

    private getNestedObject(value: {} | []): object | string | number {       
        if (_.isArray(value)) {
            return _.get(value, this.searchKeyByPredicate(value), '');
        }

        return value;
    }

    private extractValue(value: {} | []): string {
        const { path } = this.config ?? {};
       
        const objectOrValue =  this.getNestedObject(value);
        
        if (_.isObject(objectOrValue)) {
            return _.get(objectOrValue, path, '');
        }

        return _.get(value, path, value);
    }
}
