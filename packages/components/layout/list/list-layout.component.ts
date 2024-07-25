import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ListLayoutConfig } from './list-layout.model';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XmDynamicModule } from '@xm-ngx/dynamic';

@Component({
    standalone: true,
    selector: 'xm-list-layout',
    templateUrl: './list-layout.component.html',
    styleUrls: ['./list-layout.component.scss'],
    imports: [
        MatCardModule,
        XmDynamicModule,
        NgIf,
        NgForOf,
    ],
    providers: [DashboardStore],
    changeDetection: ChangeDetectionStrategy.Default, // keep OnPush
})
export class ListLayoutComponent {
   @Input() public config: ListLayoutConfig;
}
