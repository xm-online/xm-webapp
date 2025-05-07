import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { XmTranslatePipe } from '@xm-ngx/translation';

import { Action } from '../../types';
import { actions, translates } from '../../constants';

@Component({
    selector: 'xm-action-type-step',
    standalone: true,
    imports: [
        MatRadioGroup,
        MatRadioButton,
        XmTranslatePipe,
        ReactiveFormsModule,
    ],
    templateUrl: './action-type-step.component.html',
    styleUrl: './action-type-step.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionTypeStepComponent {
    @Input() public formGroup: FormGroup;
    public readonly translates = translates;
    public readonly actions: Action[] = actions;
}
