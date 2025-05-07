import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { tap } from 'rxjs';
import { MatDivider } from '@angular/material/divider';
import { MatTooltip } from '@angular/material/tooltip';

import { translates } from '../../constants';
import { RolesStateService } from '../../services/roles-state.service';
import { RoleError } from '../../types';

@Component({
    selector: 'xm-congratulations-step',
    standalone: true,
    imports: [
        MatIcon,
        XmTranslatePipe,
        MatDivider,
        MatTooltip,

    ],
    templateUrl: './congratulations-step.component.html',
    styleUrl: './congratulations-step.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CongratulationsStepComponent implements OnInit, OnDestroy {
    public transferUrlTo: string;
    public amountOfTransferredDashboards: number;
    public amountOfTransferredRoles: number;
    public actionType: string;
    public rolesErrors: RoleError[] = [];

    public readonly translates = translates;
    @Input() public formGroup: FormGroup;

    private readonly rolesService = inject(RolesStateService);
    private readonly cdr = inject(ChangeDetectorRef);

    public get selectedRolesLength(): number {
        return this.formGroup.value.rolesGroup.selected.length as number;
    }

    public ngOnInit(): void {
        const { actionTypeGroup, envGroup } = this.formGroup.value;

        this.actionType = actionTypeGroup.selectedAction;
        this.transferUrlTo = envGroup.envUrl;

        switch (this.actionType) {
            case 'transfer-dashboards': {
                this.processDashboardsSummary();
                break;
            }
            case 'update-roles': {
                this.processRolesSummary();
                break;
            }
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private processDashboardsSummary(): void {
        this.amountOfTransferredDashboards = this.formGroup.value.dashboardsGroup.selected.length;
    }

    private processRolesSummary(): void {
        this.amountOfTransferredRoles = this.selectedRolesLength;

        this.rolesService.errors$.pipe(
            tap((errors: RoleError[]) => {
                this.amountOfTransferredRoles = this.selectedRolesLength - errors.length;
                this.rolesErrors = errors;
                this.cdr.markForCheck();
            }),
            takeUntilOnDestroy(this),
        ).subscribe();
    }
}
