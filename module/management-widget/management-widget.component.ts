import { Component } from '@angular/core';

import { XmEntity } from '../../../../xm-entity';

@Component({
    selector: 'xm-management-widget',
    templateUrl: './management-widget.component.html'
})
export class ManagementWidgetComponent {

    units: XmEntity[];
    unit: any;

    constructor() {
    }
}
