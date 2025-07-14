import { MatStepper } from '@angular/material/stepper';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

export interface ProcessActionStrategy {
    readonly actionType: string;

    getHandler(stepName: string): (stepperRef: MatStepper, form: FormGroup) => Observable<unknown>;
}
