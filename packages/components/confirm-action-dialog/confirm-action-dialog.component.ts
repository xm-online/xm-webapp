import { Component, NgModule, Type } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
    ActionDecision,
    LoadingDialogConfig
} from '@xm-ngx/components/confirm-action-dialog/confirm-action/confirm-action.component';
import { ConfirmActionModule } from '@xm-ngx/components/confirm-action-dialog/index';

@Component({
    selector: 'xm-mat-dialog-test',
    template: `
        <xm-confirm-action [config]="config"
                           [loading]="loading"
                           (decisionEvent)="onPush($event)"></xm-confirm-action>
    `,
})
export class ConfirmActionDialogComponent {
    public config: LoadingDialogConfig = {
        title: 'xm-entity.function-list-card.change-state.title'
    };
    public loading;

    constructor(private matDialogRef: MatDialogRef<ConfirmActionDialogComponent, boolean>) {
    }

    public onPush(event: ActionDecision): void {
        this.loading = true;
        if (event === ActionDecision.APPROVE) {
            this.closeDialog(true);
            return;
        }
        this.closeDialog(false);
    }

    public closeDialog(data: boolean): void {
        this.matDialogRef.close(data);
    }
}

@NgModule({
        declarations: [ConfirmActionDialogComponent],
        imports: [ConfirmActionModule],
        exports: [ConfirmActionDialogComponent]
    }
)
export class ConfirmActionDialogModule {
    public entry: Type<ConfirmActionDialogComponent> = ConfirmActionDialogComponent;
}
