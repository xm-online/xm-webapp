import { buildFormGroup, JsonSchemaFormService, removeRecursiveReferences } from '@ajsf/core';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { JhiLanguageHelper } from '../../../index';
import { XmConfigService } from '../../../spec/config.service';
import { MultilingualInputV2Options } from './multilingual-input-v2-options.model';

@Component({
    selector: 'xm-multilingual-input-v2-widget',
    templateUrl: 'multilingual-input-v2.component.html',
    styles: [`
        mat-button-toggle-group {
            margin-bottom: 10px;
        }

        mat-label {
            display: block
        }
    `],

})
export class MultilingualInputV2Component implements OnInit {
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

    @Input() public layoutNode: {dataPointer: string, options: MultilingualInputV2Options};
    public options: MultilingualInputV2Options;

    public currentLanguage: string;
    public languages: string[];
    public controlValue: {languageKey: string, name: string}[];
    public text: string;

    constructor(private jsf: JsonSchemaFormService,
                private changeDetectorRef: ChangeDetectorRef,
                private languageHelper: JhiLanguageHelper,
                private xmConfigService: XmConfigService) {
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        this.controlValue = this.controlValue.filter((v) => v.languageKey);

        this.languageHelper.getAll().then((languages) => {
            this.xmConfigService.getUiConfig().subscribe((config) => {
                this.languages = (config && config.langs) ? config.langs : languages;
                this.currentLanguage = this.languages[0];
                this.onChangeLanguage(this.currentLanguage);
                this.changeDetectorRef.detectChanges();
            });
        });
    }

    public onChangeLanguage(lang: any): void {
        this.currentLanguage = lang;
        const currentLanguageItem = this.controlValue.filter((v) => v.languageKey === this.currentLanguage).shift();
        this.text = currentLanguageItem ? currentLanguageItem.name : '';
    }

    public onChangeText(): void {
        const currentLanguageItem = this.controlValue.filter((v) => v.languageKey === this.currentLanguage).shift();
        if (currentLanguageItem) {
            currentLanguageItem.name = this.text;
        } else {
            this.controlValue.push({
                languageKey: this.currentLanguage,
                name: this.text,
            });
        }
        this.updateFormArrayComponent(this.controlValue.filter(ctrl => ctrl.languageKey));
    }

    private updateFormArrayComponent(item: any): void {
        const formArray: any = this.jsf.getFormControl(this);
        while (formArray.value.length) {
            formArray.removeAt(0);
        }
        const refPointer = removeRecursiveReferences(this.layoutNode.dataPointer + '/-',
            this.jsf.dataRecursiveRefMap, this.jsf.arrayMap);
        for (const i of item) {
            const newFormControl = buildFormGroup(this.jsf.templateRefLibrary[refPointer]);
            newFormControl.setValue(i);
            formArray.push(newFormControl);
        }
        formArray.markAsDirty();
    }

}
