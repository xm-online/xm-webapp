import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    InputSignal,
    Signal,
} from '@angular/core';
import { RefreshBtnConfig } from './types/refresh-btn-config.model';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { defaultsDeep } from 'lodash';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import { DEFAULT_REFRESH_BUTTON_CONFIG } from './constants/default-refresh-btn-config.constants';
import { XmEventManagerService } from '@xm-ngx/core';
import { XmTableEventType } from '../../directives/xm-table.model';

@Component({
    selector: 'refresh-btn',
    standalone: true,
    templateUrl: './refresh-btn.component.html',
    styleUrls: ['./refresh-btn.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIconButton, MatIcon, XmLoadingModule],
})
export class RefreshBtnComponent {
    private readonly eventManager: XmEventManagerService = inject(XmEventManagerService);

    public refreshConfig: InputSignal<RefreshBtnConfig> = input<RefreshBtnConfig>();
    public tableKey: InputSignal<string | undefined> = input<string>();
    public isLoading: InputSignal<boolean> = input<boolean>();

    public config: Signal<RefreshBtnConfig> = computed(() => {
        const c: RefreshBtnConfig = this.refreshConfig();
        return defaultsDeep(DEFAULT_REFRESH_BUTTON_CONFIG, c) as RefreshBtnConfig;
    });

    public handleClick(): void {
        this.eventManager.broadcast({
            name: `${this.tableKey()}${XmTableEventType.XM_TABLE_REFRESH}`,
        });
    }
}
