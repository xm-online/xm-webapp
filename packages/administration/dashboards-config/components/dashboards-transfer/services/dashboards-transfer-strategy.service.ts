import { inject, Injectable } from '@angular/core';
import { ProcessActionStrategy } from '../types/process-action-strategy.interface';
import { MatStepper } from '@angular/material/stepper';
import { FormGroup } from '@angular/forms';
import { filter, Observable, of, tap } from 'rxjs';
import { TargetDashboardsService } from './target-dashboards.service';
import { DashboardWithWidgets } from '@xm-ngx/core/dashboard';
import { DashboardsStateService } from './dashboards-state.service';
import { XmToasterService } from '@xm-ngx/toaster';
import { translates } from '../constants';

@Injectable()
export class DashboardsTransferStrategyService implements ProcessActionStrategy {
    private readonly targetDashboardsService = inject(TargetDashboardsService);
    private readonly dashboardsStateService = inject(DashboardsStateService);
    private readonly notify: XmToasterService = inject(XmToasterService);
    public readonly translates = translates;

    public readonly actionType = 'transfer-dashboards';

    public actions: { [key: string]: (stepperRef: MatStepper, form: FormGroup) => Observable<unknown> } = {
        environment: (stepperRef: MatStepper, form: FormGroup): Observable<unknown> => {
            stepperRef.next();
            return of(null);
        },
        dashboardsSelection: (stepperRef: MatStepper, form: FormGroup): Observable<unknown> => {
            const { envUrl: url, token } = form.get('envGroup').value as { envUrl: string; token: string };

            stepperRef.next();

            return this.targetDashboardsService.getTargetDashboards({}, { url, token }).pipe(
                tap(()=> {
                    const dashboardsToTransfer = form.get('dashboardsGroup').get('selected').value as DashboardWithWidgets[];
                    this.targetDashboardsService.identifyExistedDashboard(dashboardsToTransfer);
                })
            );
        },
        dashboardsConfirmation: (stepperRef: MatStepper, form: FormGroup): Observable<unknown> => {
            const { envGroup, dashboardsGroup } = form.getRawValue();
            const { envUrl: url, token } = envGroup as { envUrl: string; token: string };
            const { selected } = dashboardsGroup as { selected: DashboardWithWidgets[] };
            const selectedDashboards = selected.filter((d: DashboardWithWidgets) => d?.id);

            return this.dashboardsStateService.transferDashboards(url, token, selectedDashboards).pipe(
                filter(Boolean),
                tap(() => {
                    this.notify.create({
                        type: 'success',
                        msg: this.translates.successMessages.dashboardSuccessfullyCreated,
                        timeout: 5000,
                    });

                    this.targetDashboardsService.clearTargetDashboards();
                }),
            );
        },
    };

    public getHandler(stepName: string): (stepperRef: MatStepper, form: FormGroup) => Observable<unknown> {
        return this.actions[stepName];
    }
}
