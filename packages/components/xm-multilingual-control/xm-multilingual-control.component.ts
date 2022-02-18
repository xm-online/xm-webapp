import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup } from '@angular/forms';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { ITranslate, LanguageService, Translate } from '@xm-ngx/translation';
import { defaultsDeep, reduce, set } from 'lodash';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';


export type MultiLanguageDataModel = {languageKey: string; name: string}[]

export type MultilingualControlData = MultiLanguageDataModel | ITranslate;

export interface LanguageOptions {
    /* undefined - default material input ('@xm-ngx/components/text-control')
    * 'textarea' - material text area input ('@xm-ngx/components/text-range-control')
    * 'wysiwyg' - angular-editor ('@xm-ngx/components/xm-angular-editor-control')
    */
    type: undefined | 'wysiwyg' | 'textarea';
}

export interface MultiLanguageOptions {
    title: Translate | ITranslate;
    feedback?: string;
    /** @deprecated use 'selector' to chose edit control type */
    language?: LanguageOptions;
    /* 'default' - [{languageKey: 'en', name: 'translation text'}]
    * 'ngxTranslate'- {en:'translation text'}
    */
    dataModel: 'default' | 'ngxTranslate';
    input?: {
        selector?: string;
        options?: unknown
    };
}

const DEFAULT: MultiLanguageOptions = {
    title: '',
    dataModel: 'default',
};

@Component({
    selector: 'xm-multilingual-control',
    templateUrl: './xm-multilingual-control.component.html',
    styles: [`
        mat-button-toggle-group {
            margin-bottom: 10px;
        }

        mat-label {
            display: block
        }
    `],
})
export class XmMultilingualControlComponent implements ControlValueAccessor, OnInit, OnDestroy {
    private _options: MultiLanguageOptions = DEFAULT;
    get options(): MultiLanguageOptions {
        return this._options;
    }

    @Input() set options(value: MultiLanguageOptions) {
        const baseOptions = defaultsDeep(value, DEFAULT) as MultiLanguageOptions;
        if (!baseOptions.input?.selector) {
            if (baseOptions.language?.type === 'textarea') {
                set(baseOptions, 'input.selector', '@xm-ngx/components/text-range-control');
                this._options = baseOptions;
                return;
            } else if (baseOptions.language?.type === 'wysiwyg') {
                set(baseOptions, 'input.selector', '@xm-ngx/components/xm-angular-editor-control');
                this._options = baseOptions;
                return;
            }
            set(baseOptions, 'input.selector', '@xm-ngx/components/text-control');
            this._options = baseOptions;
            return;
        }

        this._options = baseOptions;
    }

    public languages$: Observable<string[]>;
    public selectedLng: FormControl = new FormControl();
    public multilingualGroup: FormGroup = new FormGroup({});

    public _onChange: (v: MultilingualControlData) => void = () => undefined;
    public _onTouched: (v?: unknown) => void = () => undefined;

    constructor(private languageService: LanguageService) {
    }

    public ngOnInit(): void {
        this.initFormGroup();

        this.languages$ = this.languageService.languages$();

        this.selectCurrentLanguage();

        this.multilingualGroup.valueChanges.pipe(takeUntilOnDestroy(this)).subscribe((value: ITranslate) => {
            if (this._options.dataModel === 'ngxTranslate') {
                this._onChange(value);
            } else {
                const transformedData = reduce(value, (result, value, key) => {
                    result.push({ languageKey: key, name: value });
                    return result;
                }, []);
                this._onChange(transformedData);
            }
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private initFormGroup(): void {
        this.languageService.languages$()
            .pipe(take(1))
            .subscribe(lang => {
                for (const key of lang) {
                    this.multilingualGroup.addControl(key, new FormControl());
                }
            });
    }

    private selectCurrentLanguage(): void {
        this.languageService.locale$.pipe(takeUntilOnDestroy(this)).subscribe(lang => this.selectedLng.setValue(lang));
    }

    public writeValue(rawData: ITranslate | MultiLanguageDataModel): void {
        let data: ITranslate;

        if (Array.isArray(rawData)) {
            data = reduce(rawData, (result, el) => {
                return result[el.languageKey] = el.name;
            }, {});
        } else {
            data = rawData;
        }

        this.multilingualGroup.patchValue(data);
    }

    public registerOnChange(fn: (_: MultilingualControlData) => void): void {
        this._onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        isDisabled ? this.multilingualGroup.disable() : this.multilingualGroup.enable();
    }
}
