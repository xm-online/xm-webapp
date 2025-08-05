import { CommonModule } from '@angular/common';
import { Component, Inject, Injector, Input, OnDestroy, Optional, Self } from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
    ControlErrorModule,
    XM_CONTROL_ERRORS_TRANSLATES,
    XmControlErrorsTranslates,
} from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicInstanceService } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { defaults } from 'lodash';
import { Observable } from 'rxjs';
import { XmDateValue } from './xm-date.component';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from './shared/custom-date-adapter';

export interface XmDateControlOptions {
    hint?: HintText;
    title: Translate;
    name?: string;
    required?: boolean;
    useUtc?: boolean;
    hideClear?: boolean;
    errors?: XmControlErrorsTranslates;
    disableFutureDates?: boolean;
    intervalFromMinDateInDays?: number;
    dateNow?: boolean;
    useIsoString?: boolean;
    disableWeekends?: boolean;
    daysAhead?: number;
    availableDaysController?: {
        key?: string;
        method?: string;
    };
}

const DEFAULT_CONFIG: XmDateControlOptions = {
    hint: null,
    title: null,
    name: null,
    required: null,
    useUtc: null,
    errors: null,
    disableWeekends: null,
    daysAhead: null,
};

@Component({
    selector: 'xm-date-control',
    template: `
        <mat-form-field>
            <mat-label>{{ config?.title | translate }}</mat-label>
            <input matInput
                   (dateChange)="changeDateControl($event)"
                   [formControl]="control"
                   [min]="minDate"
                   [max]="maxDate"
                   [matDatepicker]="picker"
                   [matDatepickerFilter]="datepickerFilter"
                   [name]="config?.name"
                   [required]="config?.required"
                   (click)="picker.open()">

            <div matSuffix class="d-flex">
                <button *ngIf="value && !disabled && !config?.hideClear"
                        mat-icon-button
                        [disabled]="control.disabled"
                        aria-label="Clear"
                        (click)="control.patchValue(''); control.markAsDirty()">
                    <mat-icon>close</mat-icon>
                </button>

                <mat-datepicker-toggle [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
            </div>

            <mat-error *xmControlErrors="control?.errors; translates config?.errors; message as message">
                {{ message }}
            </mat-error>

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
    imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatInputModule,
        XmTranslationModule,
        ControlErrorModule,
        MatButtonModule,
        CommonModule,
        MatIconModule,
        HintModule,
    ],
    standalone: true,
    providers: [
        {provide: DateAdapter, useClass: CustomDateAdapter},
    ],
})
export class XmDateControl extends NgFormAccessor<XmDateValue> implements OnDestroy {
    private availableDates: Date[] = [];

    constructor(
        @Optional() @Self() public ngControl: NgControl | null,
        @Inject(XM_CONTROL_ERRORS_TRANSLATES) private xmControlErrorsTranslates: {
            [errorKey: string]: Translate
        },
        public dynamicInjector: Injector,
        private dynamicInstanceService: XmDynamicInstanceService,

    ) {
        super(ngControl);
    }

    public maxDate: Date | null;
    public minDate: Date | null;

    private _config: XmDateControlOptions = DEFAULT_CONFIG;

    @Input()
    public set config(value: XmDateControlOptions) {
        this._config = defaults(value, {
            ...DEFAULT_CONFIG,
            errors: this.xmControlErrorsTranslates,
        });

        if (this._config?.availableDaysController) {
            this.getAvailableDaysFromController();
        }

        this.maxDate = this.disableFutureDates();
        this.minDate = this.defineStartDate();
    }

    private getAvailableDaysFromController(): void {
        const { key, method } = this.config.availableDaysController;
        const controller = this.dynamicInstanceService.getControllerByKey(key, this.dynamicInjector);

        if (!controller) {
            console.warn('XmDateControl: cant get available days controller!');
            return;
        }

        (controller[method] as () => Observable<string[]>)()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((dates: string[]) => {
                this.availableDates = dates?.map((date: string) => new Date(date));
            });
    }

    private isWithinDaysAhead = (selectedDate: Date): boolean => {
        if (!Number(this.config?.daysAhead)) {
            return true;
        }
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + this.config.daysAhead);

        return selectedDate >= today && selectedDate <= futureDate;
    };

    private isWeekDay = (selectedDate: Date): boolean => {
        if(!this.config.disableWeekends){
            return true;
        }

        const day = selectedDate.getDay();
        return day !== 0 && day !== 6;
    };

    public datepickerFilter = (selectedDate: Date = new Date()): boolean => {
        if (this.availableDates?.length > 0) {
            return this.availableDates.some((d) =>
                d.toDateString() === selectedDate.toDateString(),
            );
        }

        return this.isWithinDaysAhead(selectedDate) && this.isWeekDay(selectedDate);
    };

    public get config(): XmDateControlOptions {
        return this._config;
    }

    public disableFutureDates(): Date | null {
        const maxDate = new Date();

        return this.config?.disableFutureDates ? maxDate : null;
    }

    public defineStartDate(): Date | undefined {
        if (!this.config?.dateNow) {
            return undefined;
        }
        let minDate: Date;
        if (this.config?.intervalFromMinDateInDays) {
            const startDate = new Date();
            const midNightHours = this.config?.intervalFromMinDateInDays * 24;
            startDate.setHours(midNightHours, 0, 0, 0);
            minDate = new Date(startDate);
        } else {
            minDate = new Date(Date.now());
        }

        return minDate;
    }

    public changeDateControl({value}: MatDatepickerInputEvent<unknown>): void {
        if (value instanceof Date) {
            let date: Date | string = value;
            if (this.config?.useUtc) {
                date = new Date(
                    Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()),
                );
            }
            if (this.config?.useIsoString) {
                date = date.toISOString();
            }
            this.control.setValue(date, {emitEvent: true});
            this.control.markAsTouched();
            this.control.markAsDirty();
        } else if (value === null) {
            this.control.setValue('', {emitEvent: true});
            this.control.markAsTouched();
            this.control.markAsDirty();
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
        super.ngOnDestroy();
    }
}
