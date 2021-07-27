import { Component, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';

import { XmBreadcrumb } from '../interfaces/xm-breadcrumb.interface';
import { XmBreadcrumbStore } from '../stores/xm-breadcrumb.store';

@Component({
    selector: 'xm-breadcrumb',
    templateUrl: './xm-breadcrumb.component.html',
    styleUrls: ['./xm-breadcrumb.component.scss'],
})
export class XmBreadcrumbComponent {

    @HostBinding('class') public class = 'xm-breadcrumb';

    public breadcrumbs$: Observable<XmBreadcrumb[]>;

    constructor(breadcrumbService: XmBreadcrumbStore) {
        this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
    }
}
