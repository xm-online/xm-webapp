import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JhiLanguageHelper, XmTranslationModule } from '@xm-ngx/translation';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { buildFormGroup, JsonSchemaFormService, removeRecursiveReferences } from '@ajsf/core';
import { XmConfigService } from '@xm-ngx/core/config';
import { MultilingualInputOptions } from './multilingual-input-options.model';

@Component({
    standalone: true,
    imports: [MatButtonModule, MatFormFieldModule, MatInputModule, CommonModule, FormsModule, XmTranslationModule],
    selector: 'xm-multilingual-input-widget',
    templateUrl: 'multilingual-input.component.html',
})
export class MultilingualInputComponent implements OnInit {

    @Input() public layoutNode: any;
    public options: MultilingualInputOptions & { title?: string };

    public currentLanguage: any;
    public languages: any[];
    public controlValue: any;
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

    // TODO: move it into the util class
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
