import { Component, Inject, Input, OnInit } from '@angular/core';
import {
    XmInlineControlComponent,
    XmInlineControlConfig,
} from '@xm-ngx/components/inline-control/inline-control.component';
import { FormsModule } from '@angular/forms';
import {
    XmTableCollectionControllerResolver,
    XmTableRepositoryCollectionController,
} from '@xm-ngx/components/table/table';
import { XM_DYNAMIC_TABLE_CELL, XM_DYNAMIC_TABLE_ROW } from '@xm-ngx/dynamic';
import { cloneDeep, set } from 'lodash';

@Component({
    standalone: true,
    selector: 'xm-table-edit-cell',
    imports: [XmInlineControlComponent, FormsModule],
    template: `
        <xm-inline-control [config]="config"
                           (valueChange)="onSaveEntity($event)"
                           [ngModel]="value"></xm-inline-control>
    `,
})
export class XmTableEditCellComponent implements OnInit {
    @Input() public config: XmInlineControlConfig;
    @Input() public value: unknown;
    private collection: XmTableRepositoryCollectionController;

    constructor(
        @Inject(XM_DYNAMIC_TABLE_ROW) private row: any,
        @Inject(XM_DYNAMIC_TABLE_CELL) private cell: any,
        private collectionControllerResolver: XmTableCollectionControllerResolver) {
    }

    public async ngOnInit(): Promise<void> {
        const collection = await this.collectionControllerResolver.get();
        if (!(collection instanceof XmTableRepositoryCollectionController)) {
            console.warn('XmTableEditCellComponent not support table type.');
            return;
        }
        this.collection = collection;
    }

    public onSaveEntity($event: unknown): void {
        let row = cloneDeep(this.row);
        row = set(row, this.cell.field, $event);
        this.collection.edit(this.row, row);
    }
}
