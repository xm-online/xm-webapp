import {Component, Input, OnInit} from '@angular/core';
import {buildFormGroup, JsonSchemaFormService, removeRecursiveReferences} from 'angular2-json-schema-form';
import {isNil} from 'lodash';

import {I18nNamePipe, Principal} from '../../..';
import {ExtSelectService} from '../ext-select/ext-select-service';

export interface MatMultiselectOptions {
    valueKey?: string;
    titleKey?: string;
    defaultSelectedAll?: boolean;
    useAll?: boolean;
    feedback?: string;
    disabled: boolean;
    sourceField?: string;
    enum?: string[];
    translations?: any;
    title?: string;
    url?: string;
}

interface MultiplyDataObject {
    [prop: string]: string;
}

type MultiplyData = MultiplyDataObject | string;

@Component({
    selector: 'xm-ext-mat-multiselect',
    templateUrl: './ext-mat-multiselect.component.html',
    styleUrls: ['./ext-mat-multiselect.component.scss'],
})
export class ExtMatMultiselectComponent implements OnInit {
    public TRANSLATES: { all: string, others: string, other: string } = {
        all: 'ext-common.common.all',
        others: 'ext-common.common.others',
        other: 'ext-common.common.other',
    };
    @Input() public layoutNode: any;
    public options: MatMultiselectOptions = {
        valueKey: 'value',
        titleKey: 'label',
        defaultSelectedAll: false,
        useAll: false,
        disabled: false,
    };

    public data: MultiplyData[] = [];
    public selected: MultiplyData[] = [];
    public controlValue: any;

    constructor(
        private jsf: JsonSchemaFormService,
        private selectService: ExtSelectService,
        private i18nNamePipe: I18nNamePipe,
        private principal: Principal) {
    }

    public ngOnInit(): void {
        this.options = {...this.options, ...this.layoutNode.options};
        this.jsf.initializeControl(this);
        this.fetchData(this.options);

        if (this.options.defaultSelectedAll) {
            this.selectAll();
        }
    }

    public areAllSelected(): boolean {
        return this.data.length === this.selected.length;
    }

    public byConfigProp(source: MultiplyData, prop: string): string {
        const configProp: string = this.options[prop];
        return source[configProp] ? source[configProp] : source;
    }

    public toggleOptionAll(): void {
        if (this.areAllSelected()) {
            this.deselectAll();
        } else {
            this.selectAll();
        }
    }

    public selectAll(force: boolean = false): void {
        if (!force && this.options.disabled) {
            return;
        }

        const selected = this.data.map(this.convertToBusinessValue);
        this.onSelectionChange(selected);
    }

    public deselectAll(force: boolean = false): void {
        if (!force && this.options.disabled) {
            return;
        }

        this.onSelectionChange([]);
    }

    public onSelectionChange(selected: MultiplyData[]): void {
        this.updateFormArrayComponent(selected.map(this.convertToBusinessValue));
        this.selected = selected;
        this.updateControlValue(selected);
    }

    private updateControlValue(value: MultiplyData[]): void {
        this.jsf.updateValue(this,
            this.options.valueKey
                ? value.map((item: MultiplyData) => ({[this.options.valueKey]: item}))
                : value);
    }

    private convertToBusinessValue = (value: MultiplyData) => this.byConfigProp(value, 'valueKey');

    private fetchData(options: MatMultiselectOptions): void {
        this.selected = this.controlValue.map(this.convertToBusinessValue);
        if (!isNil(options.sourceField)) {
            const array = new Function(
                'model', 'options', 'return ' + options.sourceField)(this.jsf.getData(), this.jsf.formOptions);
            this.data = this.selectService.mapArrayToView(array, options);
            return;
        }

        if (options.enum) {
            this.data = options.enum.map((item: string) => {
                const hasTranslation = this.options.translations && this.options.translations[item];
                return {
                    [this.options.titleKey]: hasTranslation
                        ? this.i18nNamePipe.transform(this.options.translations[item], this.principal)
                        : item,
                    [this.options.valueKey]: item,
                };
            });
        } else {
            this.selectService.fetchData(this.options).subscribe((elements) => {
                this.data = elements || [];
                this.onSelectionChange(this.controlValue || []);
            });
        }
    }

    private updateFormArrayComponent(item: any): void {
        /* Json form expect array of component for elements of array.*/

        const formArray: any = this.jsf.getFormControl(this);
        while (formArray.value.length) {
            formArray.removeAt(0);
        }
        const refPointer = removeRecursiveReferences(
            this.layoutNode.dataPointer + '/-',
            this.jsf.dataRecursiveRefMap,
            this.jsf.arrayMap,
        );
        for (const i in item) {
            if (item.hasOwnProperty(i)) {
                const newFormControl = buildFormGroup(this.jsf.templateRefLibrary[refPointer]);
                newFormControl.patchValue(item[i]);
                formArray.push(newFormControl);
            }
        }
        formArray.markAsDirty();
    }
}
