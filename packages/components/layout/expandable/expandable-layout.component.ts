import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ExpandableLayoutConfig } from '@xm-ngx/components/layout/expandable/expandable-layout.model';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XmDynamicModule } from '@xm-ngx/dynamic';

@Component({
    standalone: true,
    selector: 'xm-expandable-layout',
    templateUrl: './expandable-layout.component.html',
    styleUrls: ['./expandable-layout.component.scss'],
    imports: [
        XmDynamicModule,
        NgIf,
        MatExpansionModule,
    ],
    providers: [DashboardStore],
    changeDetection: ChangeDetectionStrategy.Default, // keep OnPush
})
export class ExpandableLayoutComponent {

    public config: ExpandableLayoutConfig;

}
