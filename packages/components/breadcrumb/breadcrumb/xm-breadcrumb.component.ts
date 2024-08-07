import { Component, HostBinding, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { XmBreadcrumb, XmBreadcrumbOptions } from '../interfaces/xm-breadcrumb.interface';
import { XmBreadcrumbStore } from '../stores/xm-breadcrumb.store';
import { CommonModule } from '@angular/common';
import { XmTranslationModule } from '@xm-ngx/translation';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { MatRippleModule } from '@angular/material/core';

@Component({
    selector: 'xm-breadcrumb',
    templateUrl: './xm-breadcrumb.component.html',
    styleUrls: ['./xm-breadcrumb.component.scss'],
    imports: [
        CommonModule,
        XmTranslationModule,
        RouterModule,
        MatIconModule,
        XmDynamicModule,
        MatRippleModule,
    ],
    standalone: true,
})
export class XmBreadcrumbComponent {

    @HostBinding('class') public class = 'xm-breadcrumb';

    @Input() public config: XmBreadcrumbOptions;

    public breadcrumbs$: Observable<XmBreadcrumb[]>;

    constructor(breadcrumbService: XmBreadcrumbStore) {
        this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
    }
}
