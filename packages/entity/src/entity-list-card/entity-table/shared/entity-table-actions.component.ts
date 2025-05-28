import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XM_DYNAMIC_TABLE_ROW } from '@xm-ngx/dynamic';
import { XmTranslateService, XmTranslationModule } from '@xm-ngx/translation';
import { ActionOptions } from '../../entity-list-card-options.model';
import { MatDialog } from '@angular/material/dialog';
import { FunctionCallDialogComponent } from '../../../function-call-dialog';
import { Router } from '@angular/router';
import { flattenEntityWithPath } from '../../../../entity-list-helper';
import { FunctionSpec, XmEntity } from '@xm-ngx/core/entity';

export interface XmEntityTableActionsConfig {
    actions?: ActionOptions[];
    actionsListPrivileges?: string[];
    functions?: FunctionSpec[];
}

@Component({
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        NgTemplateOutlet,
        MatMenuModule,
        XmPermissionModule,
        XmTranslationModule,
        MatIconModule,
        MatButtonModule,
    ],
    selector: 'xm-entity-table-actions',
    template: `
        <ng-container *ngIf="config?.actions?.length > 0 && row">
            <ng-container 
                *ngTemplateOutlet="config.actions.length > 1 ? moreActionsLikeMenu : oneActionLikeButton; context: {
                    $implicit: config.actions.length > 1 ? config?.actions : config.actions?.[0]
                }"

            ></ng-container>

            <ng-template #oneActionLikeButton let-action>
                <ng-container *ngIf="action && (!action.actionCondition || (action.actionCondition(row)))">
                    <button *permitted="action.privilege" mat-menu-item [class]="action.className" (click)="onAction(action)">
                        {{ action.name | translate }}
                    </button>
                </ng-container>
            </ng-template>

            <ng-template #moreActionsLikeMenu let-actions>
                <ng-container *permitted="config?.actionsListPrivileges">
                    <button [matMenuTriggerFor]="entityListActions" mat-icon-button>
                        <mat-icon>more_vert</mat-icon>
                    </button>

                    <mat-menu #entityListActions="matMenu">
                        <ng-container *ngFor="let action of actions">
                            <ng-container 
                                *ngTemplateOutlet="oneActionLikeButton; context: {
                                    $implicit: action
                                }"
                            ></ng-container>
                        </ng-container>
                    </mat-menu>
                </ng-container>
            </ng-template>
        </ng-container>
    `,
})
export class XmEntityTableActionsComponent {
    private modalService = inject(MatDialog);
    private translateService = inject(XmTranslateService);
    private router = inject(Router);

    public row = inject(XM_DYNAMIC_TABLE_ROW, { optional: true }) as XmEntity<any>;

    @Input() public config: XmEntityTableActionsConfig;
    @Input() public value: string;   

    public onAction(action: ActionOptions): void {
        if (!this.row) {
            return;
        }

        if (action.handler) {
            action.handler(this.row);

            return;
        }

        if (action.navigateByInnerUrl) {
            this.navigateByConfigUrl(action.navigateByInnerUrl, this.row);
            
            return;
        }
        
        const modalRef = this.modalService.open(FunctionCallDialogComponent, {width: '500px'});

        const dialogTitle = this.translateService.translate('xm-entity.entity-list-card.action-dialog.question', {
            action: this.translateService.translate(action.name),
            name: this.row?.name,
        });

        modalRef.componentInstance.dialogTitle = dialogTitle;
        modalRef.componentInstance.buttonTitle = action.name;
        modalRef.componentInstance.xmEntity = this.row;

        modalRef.componentInstance.functionSpec = this.config?.functions
            ? this.config?.functions
                .filter((f) => f.key === action.functionKey)
                .shift() 
            : {key: action.functionKey};
    }

    public navigateByConfigUrl(configUrl: string, e: XmEntity): void {
        const fEntity = flattenEntityWithPath(e);
        const navUrl = configUrl && configUrl.split('?')[0];
        const strParams = configUrl && configUrl.split('?')[1];
        if (navUrl) {
            try {
                const params = strParams && JSON.parse('{"' +
                    decodeURI(strParams)
                        .replace(/"/g, '\\"')
                        .replace(/&/g, '","')
                        .replace(/=/g, '":"') +
                    '"}');
                const queryParams = {};
                params && Object.keys(params).forEach(key => {
                    Object.assign(queryParams, {[key]: fEntity[params[key]]});
                });
                this.router.navigate([navUrl], {queryParams});
            } catch (e) {
                this.router.navigate([navUrl]);
            }
        }
    }
}