import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CardLayoutConfig } from './card-layout.model';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XmDynamicModule } from '@xm-ngx/dynamic';

@Component({
    standalone: true,
    selector: 'xm-card-layout',
    templateUrl: './card-layout.component.html',
    styleUrls: ['./card-layout.component.scss'],
    imports: [
        MatCardModule,
        XmDynamicModule,
        NgIf,
    ],
    providers: [DashboardStore],
    changeDetection: ChangeDetectionStrategy.Default, // keep OnPush
})
export class CardLayoutComponent {

    public config: CardLayoutConfig;

}
