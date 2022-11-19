import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { TableSelectionService } from '@xm-ngx/components/table/xm-table/selection-column/table-selection.service';
import { ActionComponent } from '@xm-ngx/components/table/xm-table/xm-table.model';


@Component({
    selector: 'xm-selection-header',
    templateUrl: './selection-header.component.html',
    styleUrls: ['./selection-header.component.scss'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [style({ opacity: 0 }), animate('500ms')]),
            transition(':leave', [animate('500ms')]),
        ]),
    ],
})
export class SelectionHeaderComponent implements OnInit {
    // @Input()
    public selected: number;
    @Input() public config: ActionComponent[];
    public inlineComponents: ActionComponent[];
    public groupComponents: ActionComponent[];
    public selectionModel;

    constructor(private selectionService: TableSelectionService<unknown>) {
        this.selectionModel = this.selectionService.selection;
    }

    public ngOnInit(): void {
        this.inlineComponents = this.config?.filter(node => node.inline);
        this.groupComponents = this.config?.filter(node => !node.inline);
    }


}
