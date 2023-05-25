import { Component, Inject, Input, OnInit } from '@angular/core';
import {
    XmInlineControlComponent,
    XmInlineControlConfig,
} from '@xm-ngx/components/inline-control/inline-control.component';
import { FormsModule } from '@angular/forms';
import {
    IXmTableCollectionController,
    XmTableCollectionControllerResolver,
} from '@xm-ngx/components/table';
import { XM_DYNAMIC_TABLE_CELL, XM_DYNAMIC_TABLE_ROW } from '@xm-ngx/dynamic';
import { cloneDeep, set } from 'lodash';
import { JavascriptCode } from '@xm-ngx/shared/interfaces';
import { ConditionModule } from '@xm-ngx/components/condition';

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
        private collectionControllerResolver: XmTableCollectionControllerResolver) {
    }

    public async ngOnInit(): Promise<void> {
        const collection = await this.collectionControllerResolver.get();
        if (!(collection.edit)) {
            console.warn('XmTableEditCellComponent call collection edit method, make sure that implements');
        }
        this.collection = collection;
    }

    public onSaveEntity($event: unknown): void {
        let row = cloneDeep(this.row);
        row = set(row, this.cell.field, $event);
        this.collection.edit(this.row, row);
    }
}
