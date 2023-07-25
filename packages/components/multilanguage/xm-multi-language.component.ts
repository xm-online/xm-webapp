import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    Input,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import {
    UntypedFormControl,
    NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule,
} from '@angular/forms';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { ITranslate, Locale, Translate, XmTranslationModule } from '@xm-ngx/translation';
import { propEq } from 'lodash/fp';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { take } from 'rxjs/operators';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { clone } from 'lodash';
import * as _ from 'lodash';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';
import { MatInput, MatInputModule } from '@angular/material/input';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ControlErrorModule } from '@xm-ngx/components/control-error';

export type MultiLanguageDataModel = { languageKey: string; name: string }[];

/**
 * List model
 * [\{ languageKey: 'ru', name: 'text_1' \}, \{ languageKey: 'en', name: 'text_2' \}]
 */
export type MultiLanguageListModel = MultiLanguageDataModel;

/**
 * Map model
 * \{ 'ru': 'text_1', 'en': 'text_2' \}
 */
export type MultiLanguageMapModel = Record<string, string>;
export type MultiLanguageModel = MultiLanguageListModel | MultiLanguageMapModel;
export type MultiLanguageType<T> =
    T extends 'array' ? MultiLanguageListModel :
    T extends 'object' ? MultiLanguageMapModel :
    never[];

export type MultiLanguageTransform = 'array' | 'object';

export interface LanguageOptions {
    type: string;
}

export interface MultiLanguageOptions {
    hint?: HintText;
    title?: Translate | ITranslate;
    feedback?: string;
    transformAs: MultiLanguageTransform;
    language?: LanguageOptions;
    maxLength?: number;
    excludeLang: string[];
}

export const MULTI_LANGUAGE_DEFAULT_OPTIONS: MultiLanguageOptions = {
    hint: null,
    title: null,
    feedback: null,
    transformAs: 'array',
    language: null,
    maxLength: null,
    excludeLang: [],
};

@Component({
    selector: 'xm-multi-language-control',
    template: `
        <mat-label *ngIf="config.title">
            <span class="pe-2">{{ config.title | translate }}</span>
            <mat-icon *ngIf="config.feedback" [matTooltip]="config.feedback | translate">help</mat-icon>
        </mat-label>

        <mat-button-toggle-group [(ngModel)]="selectedLng">
            <mat-button-toggle *ngFor="let k of languages" [value]="k">{{k}}</mat-button-toggle>
        </mat-button-toggle-group>

        <ng-container [ngSwitch]="config.language?.type">
            <ng-container *ngSwitchCase="'wysiwyg'">
                <angular-editor
                    *ngIf="!selectedLng || disabled;else wysiwigEditor"
                    [config]="disabledWysiwygConfig"
                    [ngModel]="modelToView()"></angular-editor>

                <ng-template #wysiwigEditor>
                    <angular-editor
                        [config]="wysiwygConfig"
                        [ngModel]="modelToView()"
                        (ngModelChange)="viewToModel($event)"></angular-editor>
                </ng-template>
            </ng-container>

            <ng-container *ngSwitchCase="'textarea'">
                <mat-form-field>
                    <textarea
                        matInput
                        type="text"
                        [disabled]="!selectedLng || disabled"
                        [attr.name]="name"
                        [readonly]="readonly"
                        [ngModel]="modelToView()"
                        (ngModelChange)="viewToModel($event)"></textarea>

                    <mat-hint [hint]="config.hint"></mat-hint>

                    <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>
                </mat-form-field>
            </ng-container>

            <ng-container *ngSwitchDefault>
                <mat-form-field>
                    <input
                        matInput
                        type="text"
                        [disabled]="!selectedLng || disabled"
                        [ngModel]="modelToView()"
                        [attr.name]="name"
                        [attr.maxlength]="config.maxLength"
                        [readonly]="readonly"
                        (ngModelChange)="viewToModel($event)"/>

                    <mat-hint
                        *ngIf="config.maxLength"
                        align="end"
                        style="min-width: fit-content">
                        {{modelToView().length}} / {{config.maxLength}}
                    </mat-hint>

                    <mat-hint [hint]="config.hint"></mat-hint>

                    <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>
                </mat-form-field>
            </ng-container>
        </ng-container>
    `,
    host: {
        class: 'xm-multi-language-control',
    },
    imports: [
        CommonModule,
        XmTranslationModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        MatIconModule,
        MatTooltipModule,
        AngularEditorModule,
        HintModule,
        ControlErrorModule,
        ReactiveFormsModule,
    ],
    standalone: true,
    styles: ['mat-button-toggle-group{margin-bottom: 10px;} mat-label{display:block}'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiLanguageComponent),
            multi: true,
        },
    ],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class MultiLanguageComponent extends NgModelWrapper<MultiLanguageModel>
    implements XmDynamicPresentation<MultiLanguageModel, MultiLanguageOptions>, AfterViewInit, OnDestroy {

    public disabledWysiwygConfig: AngularEditorConfig = {
        editable: false,
        showToolbar: false,
    };

    public wysiwygConfig: AngularEditorConfig = {
        editable: true,
        showToolbar: true,
        defaultParagraphSeparator: 'p',
        toolbarHiddenButtons: [
            ['fontName'],
            [
                'backgroundColor',
                'insertImage',
                'insertVideo',
            ],
        ],
    };

    public selectedLng: string;
    public languages: string[] = [];

    @Input() public readonly: boolean;
    @Input() public name: string | null = null;

    private _control?: UntypedFormControl;

    @Input() set control(control: UntypedFormControl | null) {
        this._control = control;
        this.setDisabledState(this._control?.disabled);
    }

    get control(): UntypedFormControl {
        return this._control;
    }

    private _config: MultiLanguageOptions = clone(MULTI_LANGUAGE_DEFAULT_OPTIONS);

    @Input()
    public set config(value: MultiLanguageOptions) {
        this._config = _.defaults({}, value, MULTI_LANGUAGE_DEFAULT_OPTIONS);
    }

    public get config(): MultiLanguageOptions {
        return this._config;
    }

    @ViewChild(MatInput) public matInput: MatInput;

    constructor(private xmConfigService: XmUiConfigService<{ langs: Locale[] }>) {
        super();
    }

    public ngAfterViewInit(): void {
        // Trick, validators apply to parent control, but mat-error required the nearest control
        this.control?.valueChanges.pipe(
            takeUntilOnDestroy(this),
        ).subscribe(() => {
            this.matInput.ngControl.control.setErrors(this.control.errors);
            this.setDisabledState(this.control.disabled);
        });
    }

    public ngOnInit(): void {
        this.xmConfigService.config$().pipe(take(1)).subscribe(config => {
            this.languages = _.difference(config.langs, this.config.excludeLang);
            this.selectedLng = this.languages[0];
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private getValue<T extends MultiLanguageTransform>(): MultiLanguageType<T> {
        return this.value as MultiLanguageType<T>;
    }

    private transformAsObject() {
        return this.config?.transformAs === 'object';
    }

    public modelToView(): string {
        if (!this.value) {
            return '';
        }

        if (this.transformAsObject()) {
            const value = this.getValue<'object'>();
            return value[this.selectedLng] ?? '';
        }

        const oldValue = (this.getValue<'array'>() ?? []).slice();
        const langValue = oldValue.find(propEq('languageKey', this.selectedLng));

        return langValue ? langValue.name : '';
    }

    public viewToModel(value: string): void {
        if (this.transformAsObject()) {
            if (!value) {
                delete this.value[this.selectedLng];
            } else {
                this.value = {
                    ...this.value,
                    [this.selectedLng]: value,
                };
            }
            if (_.isEmpty(this.value)) {
                this.value = null;
            }
        } else {
            const oldValue = (this.getValue<'array'>() ?? []);
            const langValue = {languageKey: this.selectedLng, name: value};

            const index = oldValue.findIndex(propEq('languageKey', this.selectedLng));

            if (index > -1) {
                oldValue.splice(index, 1, langValue);
            } else {
                this.value = [...oldValue, langValue];
            }
        }

        this.change(this.value);

        if (this.control) {
            this.control.setValue(this.value);
            this.control.markAsTouched();
            this.control.markAsDirty();
        }
        this.setDisabledState(this.control?.disabled);
    }
}
