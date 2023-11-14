import { Component, Inject, Input, OnInit } from '@angular/core';
import { XmInlineControlComponent, XmInlineControlConfig, } from '@xm-ngx/components/inline-control';
import { FormsModule } from '@angular/forms';
import { IXmTableCollectionController } from '../collections/i-xm-table-collection-controller';

import { XM_DYNAMIC_TABLE_CELL, XM_DYNAMIC_TABLE_ROW } from '@xm-ngx/dynamic';
import { cloneDeep, set } from 'lodash';
import { JavascriptCode } from '@xm-ngx/interfaces';
import { ConditionModule } from '@xm-ngx/components/condition';
import { XmTableDirective } from '../directives/xm-table.directive';

export type XmTableEditCellConfig = XmInlineControlConfig & {
    condition: JavascriptCode;
}

@Component({
    standalone: true,
    selector: 'xm-table-edit-cell',
    imports: [XmInlineControlComponent, FormsModule, ConditionModule],
    template: `
        <ng-container *xmCondition="config.condition; arguments: { row, cell, value }">
            <xm-inline-control
                [config]="config"
                (saveValue)="onSaveEntity($event)"
                [ngModel]="value"></xm-inline-control>
        </ng-container>
    `,
})
export class XmTableEditCellComponent implements OnInit {
    @Input() public config: XmTableEditCellConfig;
    @Input() public value: unknown;
    private collection: IXmTableCollectionController<unknown>;

    constructor(
        @Inject(XM_DYNAMIC_TABLE_ROW) public row: any,
        @Inject(XM_DYNAMIC_TABLE_CELL) public cell: any,
        private tableDirective: XmTableDirective) {
    }

    public ngOnInit(): void {
        this.assignCollectionFromTable();
    }

    public assignCollectionFromTable(): void {
        const collection = this.tableDirective.xmTableController;
        if (!(collection.edit)) {
            console.warn('XmTableDirective.controller.edit() method is not exists. Make sure that implements.');
        }
        this.collection = collection;
    }

    public onSaveEntity($event: unknown): void {
        let row = cloneDeep(this.row);
        row = set(row, this.cell.field, $event);
        this.collection.edit(this.row, row);
    }
}
