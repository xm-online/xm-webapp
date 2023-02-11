import { Component, Input, OnInit } from '@angular/core';
import {
    XmInlineControlComponent,
    XmInlineControlConfig,
} from '@xm-ngx/components/inline-control/inline-control.component';
import { FormsModule } from '@angular/forms';
import { XmTableCollectionControllerResolver } from '@xm-ngx/components/table/table';

@Component({
    standalone: true,
    selector: 'xm-table-edit-cell',
    imports: [XmInlineControlComponent, FormsModule],
    template: `
        <xm-inline-control [config]="config"
                           (valueChange)=""
                           [ngModel]="value"></xm-inline-control>
    `,
})
export class XmTableEditCellComponent implements OnInit{
    @Input() public config: XmInlineControlConfig;
    @Input() public value: unknown;
    constructor(private collectionControllerResolver: XmTableCollectionControllerResolver) {
    }

    public ngOnInit(): void {
    }
}
