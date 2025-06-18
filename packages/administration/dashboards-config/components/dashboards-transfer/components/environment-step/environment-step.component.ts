import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { ControlErrorModule, XmControlErrorsTranslates } from '@xm-ngx/components/control-error';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { XmTranslatePipe } from '@xm-ngx/translation';

import { EnvironmentUrl } from '../../types';
import { errorTranslations, translates } from '../../constants';

@Component({
    selector: 'xm-environment-step',
    standalone: true,
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        MatError,
        ControlErrorModule,
        ReactiveFormsModule,
        XmTranslatePipe,
        MatAutocomplete,
        MatOption,
        MatAutocompleteTrigger,
    ],
    templateUrl: './environment-step.component.html',
    styleUrl: './environment-step.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvironmentStepComponent {
    @Input() public formGroup: FormGroup;
    @Input() public environments: EnvironmentUrl[];

    public readonly translates = translates;
    public readonly extraErrorTranslations: XmControlErrorsTranslates = errorTranslations;
}
