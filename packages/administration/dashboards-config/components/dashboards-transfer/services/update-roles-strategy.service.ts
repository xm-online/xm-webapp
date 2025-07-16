import { inject, Injectable } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { FormGroup } from '@angular/forms';
import { delay, filter, Observable, of, tap } from 'rxjs';
import { ProcessActionStrategy } from '../types/process-action-strategy.interface';
import { Role } from '@xm-ngx/core/role';
import { RolesStateService } from './roles-state.service';
import { XmToasterService } from '@xm-ngx/toaster';
import { translates } from '../constants';

@Injectable()
export class UpdateRolesStrategyService implements ProcessActionStrategy {
    private rolesStateService = inject(RolesStateService);
    private readonly notify: XmToasterService = inject(XmToasterService);
    public readonly translates = translates;

    public readonly actionType = 'update-roles';

    public actions: { [key: string]: (stepperRef: MatStepper, form: FormGroup) => Observable<unknown> } = {
        environment: (stepperRef: MatStepper, form: FormGroup): Observable<unknown> => {
            stepperRef.next();

            return of(null);
        },
        rolesSelection: (stepperRef: MatStepper, form: FormGroup): Observable<unknown> => {
            stepperRef.next();

            return of(null);
        },
        rolesConfirmation: (stepperRef: MatStepper, form: FormGroup): Observable<unknown> => {
            const { envGroup, rolesGroup } = form.getRawValue();
            const { envUrl: url, token } = envGroup as { envUrl: string; token: string };
            const { selected } = rolesGroup as { selected: Role[] };
            const selectedRoles: Role[] = selected.filter((role: Role) => role?.roleKey);

            return this.rolesStateService.updateRoles(selectedRoles, { url, token }).pipe(
                filter(Boolean),
                tap(() => {
                    this.notify.create({
                        type: 'success',
                        msg: this.translates.successMessages.rolesSuccessfullyUpdated,
                        timeout: 5000,
                    });
                }),
                delay(500),
                tap(() => {
                    stepperRef.next();
                }),
            );
        }
    };

    public getHandler(stepName: string): (stepperRef: MatStepper, form: FormGroup) => Observable<unknown> {
        return this.actions[stepName];
    }
}
