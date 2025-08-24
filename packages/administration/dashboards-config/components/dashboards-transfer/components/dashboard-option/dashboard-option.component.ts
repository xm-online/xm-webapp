import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DashboardWithWidgets } from '@xm-ngx/core/dashboard';

@Component({
    selector: 'xm-dashboard-option',
    standalone: true,
    imports: [],
    templateUrl: './dashboard-option.component.html',
    styleUrl: './dashboard-option.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardOptionComponent {
    @Input() public showActionColumn: boolean = false;
    @Input() public dashboard!: DashboardWithWidgets;
}
