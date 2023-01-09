import { Component, Input } from '@angular/core';
import { ActionComponent } from '@xm-ngx/components/table/xm-table/xm-table.model';
import { Translate } from '@xm-ngx/translation';

@Component({
    selector: 'xm-table-header',
    templateUrl: './table-header.component.html',
    styleUrls: ['./table-header.component.scss'],
})
export class TableHeaderComponent {
    @Input() public title: Translate;
    @Input() public filters: any;
    @Input() public actionsForAll: ActionComponent[];

}
