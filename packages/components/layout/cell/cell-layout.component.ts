import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ConditionModule } from '@xm-ngx/components/condition';
import { XM_DYNAMIC_TABLE_ROW, XmDynamicModule } from '@xm-ngx/dynamic';
import { CellLayoutConfig } from './cell-layout.model';

@Component({
    standalone: true,
    selector: 'xm-cell-layout',
    templateUrl: './cell-layout.component.html',
    styleUrls: ['./cell-layout.component.scss'],
    imports: [
        XmDynamicModule,
        NgIf,
        ConditionModule,
    ],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class CellLayoutComponent {
    @Input() public config: CellLayoutConfig;

    public row: unknown = inject(XM_DYNAMIC_TABLE_ROW);
}
