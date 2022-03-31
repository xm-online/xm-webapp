import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { ITranslate, Locale, Translate } from '@xm-ngx/translation';
import { propEq } from 'lodash/fp';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { take } from 'rxjs/operators';
import { HintText } from '@xm-ngx/components/hint';
import { clone } from 'lodash';
import * as _ from 'lodash';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';

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
}

export const MULTI_LANGUAGE_DEFAULT_OPTIONS: MultiLanguageOptions = {
    hint: null,
    title: null,
    feedback: null,
    transformAs: 'array',
    language: null,
};

@Component({
    selector: 'xm-multi-language-control',
    template: `
        <mat-label *ngIf="options.title">
            <span class="pr-2">{{ options.title | translate }}</span>
            <mat-icon *ngIf="options.feedback" [matTooltip]="options.feedback | translate">help</mat-icon>
        </mat-label>

        <mat-button-toggle-group [(ngModel)]="selectedLng">
            <mat-button-toggle *ngFor="let k of languages" [value]="k">{{k}}</mat-button-toggle>
        </mat-button-toggle-group>

        <ng-container [ngSwitch]="options.language?.type">
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

                    <mat-hint [hint]="options.hint"></mat-hint>
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
                        [readonly]="readonly"
                        (ngModelChange)="viewToModel($event)"/>

                    <mat-hint [hint]="options.hint"></mat-hint>
                </mat-form-field>
            </ng-container>
        </ng-container>
    `,
    host: {
        class: 'xm-multi-language-control',
    },
    styles: ['mat-button-toggle-group{margin-bottom: 10px;} mat-label{display:block}'],
    providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MultiLanguageComponent), multi: true}],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class MultiLanguageComponent extends NgModelWrapper<MultiLanguageModel>
    implements XmDynamicPresentation<MultiLanguageModel, MultiLanguageOptions> {

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
    @Input() public control?: FormControl;

    private _options: MultiLanguageOptions = clone(MULTI_LANGUAGE_DEFAULT_OPTIONS);

    @Input()
    public set options(value: MultiLanguageOptions) {
        this._options = _.defaults({}, value, MULTI_LANGUAGE_DEFAULT_OPTIONS);
    }

    public get options(): MultiLanguageOptions {
        return this._options;
    }

    constructor(private xmConfigService: XmUiConfigService<{ langs: Locale[] }>) {
        super();
    }

    public ngOnInit(): void {
        this.xmConfigService.config$().pipe(take(1)).subscribe(config => {
            this.languages = config.langs;
            this.selectedLng = this.languages[0];
        });
    }

    private getValue<T extends MultiLanguageTransform>(): MultiLanguageType<T> {
        return this.value as MultiLanguageType<T>;
    }

    private transformAsObject() {
        return this.options?.transformAs === 'object';
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
            this.value = {
                ...this.value,
                [this.selectedLng]: value,
            };
        } else {
            const oldValue = (this.getValue<'array'>() ?? []);
            const langValue = { languageKey: this.selectedLng, name: value };

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
    }
}
