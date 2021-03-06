import {
    AfterViewInit,
    ChangeDetectorRef,
    Component, forwardRef, Inject,
    Input,
    OnDestroy,
    OnInit,
    Version,
    ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect, VERSION } from '@angular/material';
import {
    buildFormGroup,
    JsonSchemaFormComponent,
    JsonSchemaFormService,
    removeRecursiveReferences
} from 'angular2-json-schema-form';
import { ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Principal } from '../../../auth/principal.service';
import { I18nNamePipe } from '../../../language/i18n-name.pipe';
import { ExtSelectService } from '../ext-select/ext-select-service';
import { ExtMultiSelectOptions } from './ext-multi-select-options.model';
import { BaseExtSelectComponent } from "../ext-select/base-ext-select.component";

interface Element {
    label: any;
    value: any;
}

@Component({
    selector: 'xm-ext-multi-select-widget',
    templateUrl: 'ext-multi-select.component.html',
})
export class ExtMultiSelectComponent extends BaseExtSelectComponent implements OnInit, OnDestroy, AfterViewInit {
    public version: Version = VERSION;

    public elementMultiCtrl: any;
    public elementMultiFilterCtrl: FormControl = new FormControl();
    public filteredElementsMulti: ReplaySubject<Element[]> = new ReplaySubject<Element[]>(1);
    @ViewChild('multiSelect', {static: false}) public multiSelect: MatSelect;
    @Input() public layoutNode: any;
    public options: ExtMultiSelectOptions;
    public elements: any;
    protected controlValue: any;
    protected dataIndex: number[];

    constructor(@Inject(forwardRef(() => JsonSchemaFormComponent)) private _parent: JsonSchemaFormComponent,
                private jsf: JsonSchemaFormService,
                private selectService: ExtSelectService,
                private i18nNamePipe: I18nNamePipe,
                private changeDetectorRef: ChangeDetectorRef,
                public principal: Principal) {
        super();
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        this.elements = [];
        if (!ExtSelectService.isTemplateUrl(this.options.url)) {
            this.fetchData(this.options);
            return;
        }
        this.fetchByLiteral();
    }

    public ngAfterViewInit(): void {
        this.setInitialValue();
    }

    public ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    public initOptionList(): void {
        this.filteredElementsMulti.next(this.elements.slice());
        this.elementMultiCtrl = this.setSelected(this.controlValue);
        this.elementMultiFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterElementsMulti();
            });
    }

    public getParentJsf(): JsonSchemaFormService {
        return this._parent.jsf;
    }

    public getJsf(): JsonSchemaFormService {
        return this.jsf;
    }

    public updateValue(event: any): void {
        this.updateFormArrayComponent(event.value.map((e) => e.value));
        this.controlValue = event.value.value;
    }

    private setInitialValue(): void {
        this.filteredElementsMulti
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                this.multiSelect.compareWith = (a: Element, b: Element) => a.value === b.value;
            });
    }

    private setSelected(cValue: any[]): any[] {
        const selectedVal = [];
        this.elements.forEach((el) => {
            cValue.forEach((c) => {
                if (el.value === c) {
                    selectedVal.push(el);
                }
            });
        });
        return selectedVal;
    }

    private filterElementsMulti(): void {
        if (!this.elements) {
            return;
        }
        let search = this.elementMultiFilterCtrl.value;
        if (!search && search == null) {
            this.filteredElementsMulti.next(this.elements.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteredElementsMulti.next(
            this.elements.filter((e) => e.value.toLowerCase().indexOf(search) > -1),
        );
    }

    protected fetchData(options: any): void {
        if (options.sourceField) {
            const array = new Function('model', 'options', 'return '
                + options.sourceField)(this.jsf.getData(), this.jsf.formOptions);
            this.elements = this.selectService.mapArrayToView(array, options);
            if (array !== false) {
                this.initOptionList();
                return;
            }
        }

        this.elements = [];
        if (options.enum) {
            options.enum.forEach((it) => {
                if (this.options.translations && this.options.translations[it]) {
                    this.elements.push({
                        label: this.i18nNamePipe.transform(this.options.translations[it], this.principal),
                        value: it,
                    });
                } else {
                    this.elements.push({label: it, value: it});
                }
                this.initOptionList();
            });
        } else {
            this.selectService.fetchData(options).subscribe((elements) => {
                this.elements = elements;
                this.initOptionList();
                this.changeDetectorRef.detectChanges();
            }, (error) => {
                console.warn(error);
            });
        }
    }

    private updateFormArrayComponent(item: any): void {
        /* Json form expect array of component for elements of array.*/

        const formArray: any = this.jsf.getFormControl(this);
        while (formArray.value.length) {
            formArray.removeAt(0);
        }
        const refPointer = removeRecursiveReferences(this.layoutNode.dataPointer + '/-',
            this.jsf.dataRecursiveRefMap, this.jsf.arrayMap);
        // tslint:disable-next-line:forin
        for (const i in item) {
            const newFormControl = buildFormGroup(this.jsf.templateRefLibrary[refPointer]);
            newFormControl.setValue(item[i]);
            formArray.push(newFormControl);
        }
        formArray.markAsDirty();
    }
}
