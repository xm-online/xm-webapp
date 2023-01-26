import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LoadingBarModule } from '@xm-ngx/components/loading-bar';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'xm-table-loading',
    template: `
        <tr mat-header-row
            *matHeaderRowDef="loading ? ['loading'] : null"
            class="loadingRow">
            <xm-loading-bar [visible]="true"></xm-loading-bar>
        </tr>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        LoadingBarModule,
        MatTableModule,
    ],
})
export class XmTableLoadingComponent {
    @Input() public loading: number;
}
