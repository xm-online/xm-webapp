import {
    Component,
    Input,
    Optional,
    SkipSelf,
} from '@angular/core';
import {
    FormArray,
    NgControl, ReactiveFormsModule,
} from '@angular/forms';
import {
    NgModelWrapper
} from '@xm-ngx/components/ng-accessor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Defaults, interpolate } from '@xm-ngx/operators';

export interface ChipsControlConfig {
    title?: Translate,
    multiple?: boolean;
    items?: {title: Translate, value: string}[],
}

export const ChipsControlConfigDefault: ChipsControlConfig = {
    multiple: true,
};

@Component({
    standalone: true,
    selector: 'xm-chips-control',
    template: `
        <div class="col-12 mb-3">
            <mat-chip-listbox
                [multiple]="config?.multiple"
                [formControl]="control"
            >
                <mat-chip-option *ngFor="let option of config.items"
                                 color="accent"
                                 class="chip-option"
                                 [value]="getInterpolatedValue(option.value)"
                >
                    {{option.title | translate}}
                </mat-chip-option>
                <input type="text" hidden>
            </mat-chip-listbox>
        </div>
    `,
    styleUrls: ['./chips-control.component.scss'],
    imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        CommonModule,
        XmTranslationModule,
        MatChipsModule,
        MatIconModule,
        MatInputModule,
    ],
})
export class ChipsControlComponent extends NgModelWrapper<string[]> {
    @Input() @Defaults(ChipsControlConfigDefault)
    public config: ChipsControlConfig;

    public control: FormArray = new FormArray([]);
    public selected: boolean;

    constructor(
        @Optional() @SkipSelf() public ngControl: NgControl,
    ) {
        super();
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    public getInterpolatedValue(value: string): string {
        return interpolate(value, null);
    }
}
