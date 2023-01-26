import {animate, style, transition, trigger} from '@angular/animations';
import {Component, Input} from '@angular/core';
import {XmTableSelectionService} from '@xm-ngx/components/table/xm-table/service/xm-table-selection-service/xm-table-selection.service';
import {ActionComponent} from '@xm-ngx/components/table/xm-table/xm-table.model';


@Component({
    selector: 'xm-selection-header',
    templateUrl: './selection-header.component.html',
    styleUrls: ['./selection-header.component.scss'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [style({opacity: 0}), animate('500ms')]),
            transition(':leave', [animate('500ms')]),
        ]),
    ],
})
export class SelectionHeaderComponent {
    public inlineComponents: ActionComponent[];
    public groupComponents: ActionComponent[];

    private _config: ActionComponent[];

    public get config(): ActionComponent[] {
        return this._config;
    }

    @Input()
    public set config(value: ActionComponent[]) {
        this._config = value;
        this.inlineComponents = this._config?.filter(node => node.inline);
        this.groupComponents = this._config?.filter(node => !node.inline);
    }

    public selectionModel;

    constructor(private selectionService: XmTableSelectionService<unknown>) {
        this.selectionModel = this.selectionService.selection;
    }
}
