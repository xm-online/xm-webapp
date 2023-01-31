import { Component, Input, OnInit } from '@angular/core';
import { XmTableSelectionService } from '../../controllers/selections/xm-table-selection.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'xm-table-actions-buttons',
    standalone: true,
    templateUrl: './xm-table-actions-buttons.component.html',
    styleUrls: ['./xm-table-actions-buttons.component.scss'],
    imports: [
        MatMenuModule,
        MatIconModule,
        XmDynamicModule,
        NgForOf,
        MatButtonModule,
        NgIf
    ]
})
export class XmTableActionsButtonsComponent implements OnInit {
    @Input() public config: any;


    public inlineComponents: any;
    public groupComponents: any;
    public selectionModel: any;

    constructor(selectionService: XmTableSelectionService<any>) {
        this.selectionModel = selectionService.selection;
    }

    public ngOnInit(): void {
        // TODO:
    }

}
