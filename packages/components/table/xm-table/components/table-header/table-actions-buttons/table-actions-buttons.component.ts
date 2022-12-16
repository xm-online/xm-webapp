import { Component, Input, OnInit } from '@angular/core';
import { TableSelectionService } from '@xm-ngx/components/table/xm-table/service/xm-table-selection-service/table-selection.service';

@Component({
    selector: 'xm-table-actions-buttons',
    templateUrl: './table-actions-buttons.component.html',
    styleUrls: ['./table-actions-buttons.component.scss'],
})
export class TableActionsButtonsComponent implements OnInit {
    @Input() public config: any;

    public inlineComponents: any;
    public groupComponents: any;
    public selectionModel: any;

    constructor(selectionService: TableSelectionService<any>) {
        this.selectionModel = selectionService.selection;
    }

    ngOnInit(): void {
    }

}
