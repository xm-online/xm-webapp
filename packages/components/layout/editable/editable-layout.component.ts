import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EditableLayoutConfig } from '@xm-ngx/components/layout/editable/editable-layout.model';
import { EDIT_STATE, EditStateStoreService } from '@xm-ngx/controllers/features/edit-state-store';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import {
    XmDynamicInjectionTokenStoreService
} from '@xm-ngx/dynamic/src/services/xm-dynamic-injection-token-store.service';
import { map, Observable } from 'rxjs';

@Component({
    standalone: true,
    selector: 'xm-editable-layout',
    templateUrl: './editable-layout.component.html',
    styleUrls: ['./editable-layout.component.scss'],
    imports: [
        XmDynamicModule,
        NgIf,
        AsyncPipe,
    ],
    providers: [DashboardStore],
    changeDetection: ChangeDetectionStrategy.Default, // keep OnPush
})
export class EditableLayoutComponent {

    public config: EditableLayoutConfig;

    private dynamicInjectionTokenStore = inject(XmDynamicInjectionTokenStoreService);

    private editStateStore = inject<EditStateStoreService>(this.dynamicInjectionTokenStore.resolve('edit-state-store'));

    public isStateView: Observable<boolean> = this.editStateStore.state$.pipe(map(state => state === EDIT_STATE.VIEW));

}
