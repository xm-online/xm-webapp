import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Dashboard } from '@xm-ngx/core/dashboard';

@Component({
    selector: 'xm-dashboard-option',
    standalone: true,
    imports: [],
    templateUrl: './dashboard-option.component.html',
    styleUrl: './dashboard-option.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardOptionComponent {
    @Input() public dashboard!: Dashboard;
}
