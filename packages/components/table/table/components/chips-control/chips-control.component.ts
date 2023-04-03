import {
    Component,
    Input,
    OnInit,
    Optional,
    SkipSelf
} from '@angular/core';
import {
    AbstractControl,
    NgControl, ReactiveFormsModule,
} from '@angular/forms';
import {
    NgModelWrapper
} from '@xm-ngx/components/ng-accessor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { interpolate } from '@xm-ngx/shared/operators';
import { MatInputModule } from '@angular/material/input';

export interface ChipsControlConfig {
    title: Translate,
    elasticTemplateRequest: string,
}

@Component({
    standalone: true,
    selector: 'xm-chips-control',
    template: `
        <mat-chip-listbox>
            <mat-chip-option
                [selected]="!!control.value"
                (selectionChange)="selectionChange($event)">
                {{config.title | translate}}
            </mat-chip-option>
            <input type="text" hidden [formControl]="control">
        </mat-chip-listbox>
    `,
    styleUrls: ['./chips-control.component.scss'],
    imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        CommonModule,
        XmTranslationModule,
        MatChipsModule,
        MatIconModule,
        MatInputModule
    ]
})
export class ChipsControlComponent extends NgModelWrapper<string | null> implements OnInit {
    @Input() public config: ChipsControlConfig;
    public control: AbstractControl;

    constructor(
        @Optional() @SkipSelf() public ngControl: NgControl,
    ) {
        super();
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    public ngOnInit(): void {
        this.control = this.ngControl?.control;
    }

    public selectionChange(event: MatChipSelectionChange): void {
        const value = event.selected
            ? interpolate(
                this.config.elasticTemplateRequest,
                null
            )
            : null;

        this._onChange(value);
        this.valueChange.next(value);
    }
}
