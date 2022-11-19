import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'xm-table-header',
    templateUrl: './table-header.component.html',
    styleUrls: ['./table-header.component.scss'],
})
export class TableHeaderComponent implements OnInit {
    @Input() public title: any;
    @Input() public filters: any;
    @Input() public actionsForAll: any;


    constructor() {
    }

    ngOnInit(): void {
    }

}
