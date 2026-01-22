import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EDIT_STATE, EditStateStoreService } from '@xm-ngx/controllers/features/edit-state-store';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { injectByKey, XmDynamicModule } from '@xm-ngx/dynamic';
import { map, Observable } from 'rxjs';
import { EditableLayoutConfig } from './editable-layout.model';

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
export class EditableLayoutComponent implements OnInit {

    public config: EditableLayoutConfig;

    private editStateStore = injectByKey<EditStateStoreService>('edit-state-store');

    public isStateView: Observable<boolean> = this.editStateStore.state$.pipe(map(state => state === EDIT_STATE.VIEW));

    public ngOnInit(): void {
        if (this.config.defaultEditState) {
            this.editStateStore.change(this.config.defaultEditState);
        }
    }
}
