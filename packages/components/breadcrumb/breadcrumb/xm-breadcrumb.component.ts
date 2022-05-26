import { Component, HostBinding, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { XmBreadcrumb, XmBreadcrumbOptions } from '../interfaces/xm-breadcrumb.interface';
import { XmBreadcrumbStore } from '../stores/xm-breadcrumb.store';

@Component({
    selector: 'xm-breadcrumb',
    templateUrl: './xm-breadcrumb.component.html',
    styleUrls: ['./xm-breadcrumb.component.scss'],
})
export class XmBreadcrumbComponent {

    @HostBinding('class') public class = 'xm-breadcrumb';

    @Input() public options: XmBreadcrumbOptions;

    public breadcrumbs$: Observable<XmBreadcrumb[]>;

    constructor(breadcrumbService: XmBreadcrumbStore) {
        this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
    }
}
