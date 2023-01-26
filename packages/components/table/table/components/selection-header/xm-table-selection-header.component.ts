import {animate, style, transition, trigger} from '@angular/animations';
import {Component, Input} from '@angular/core';
import { XmTableAction } from '../../interfaces/xm-table.model';
import {
    XmTableSelectionService,
} from '../../controllers/selections/xm-table-selection.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgForOf, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { XmDynamicModule } from '@xm-ngx/dynamic';


@Component({
    selector: 'xm-table-selection-header',
    templateUrl: './xm-table-selection-header.component.html',
    standalone: true,
    styleUrls: ['./xm-table-selection-header.component.scss'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [style({ opacity: 0 }), animate('500ms')]),
            transition(':leave', [animate('500ms')]),
        ]),
    ],
    imports: [
        MatButtonModule,
        MatMenuModule,
        NgForOf,
        NgIf,
        MatIconModule,
        XmDynamicModule,
    ],
})
export class XmTableSelectionHeaderComponent {
    public inlineComponents: XmTableAction[];
    public groupComponents: XmTableAction[];

    private _config: XmTableAction[];

    public get config(): XmTableAction[] {
        return this._config;
    }

    @Input()
    public set config(value: XmTableAction[]) {
        this._config = value;
        this.inlineComponents = this._config?.filter(node => node.inline);
        this.groupComponents = this._config?.filter(node => !node.inline);
    }

    public selectionModel;

    constructor(private selectionService: XmTableSelectionService<unknown>) {
        this.selectionModel = this.selectionService.selection;
    }
}
