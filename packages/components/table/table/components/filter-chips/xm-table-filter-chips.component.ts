import { Component, Input, OnInit } from '@angular/core';
import { EntitiesFilterWidgetModule } from '@xm-ngx/ext/entity-webapp-ext/module/entities-filter-widget';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'xm-table-filter-chips',
    standalone: true,
    templateUrl: './xm-table-filter-chips.component.html',
    styleUrls: ['./xm-table-filter-chips.component.scss'],
    imports: [
        EntitiesFilterWidgetModule,
        NgIf,
        MatButtonModule
    ]
})
export class XmTableFilterChipsComponent implements OnInit {

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
