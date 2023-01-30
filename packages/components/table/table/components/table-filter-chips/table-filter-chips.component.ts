import { Component, Input, OnInit } from '@angular/core';
import { EntitiesFilterWidgetModule } from '@xm-ngx/ext/entity-webapp-ext/module/entities-filter-widget';
import { NgIf } from '@angular/common';

@Component({
    selector: 'xm-table-filter-chips',
    standalone: true,
    templateUrl: './table-filter-chips.component.html',
    styleUrls: ['./table-filter-chips.component.scss'],
    imports: [
        EntitiesFilterWidgetModule,
        NgIf
    ]
})
export class TableFilterChipsComponent implements OnInit {

    @Input() public config: any;

    checkOverflow (element) {
        return element.offsetHeight < element.scrollHeight ||
            element.offsetWidth < element.scrollWidth;
    }

    constructor() {
    }

    ngOnInit(): void {
    }

}
