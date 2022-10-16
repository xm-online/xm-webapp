import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    forwardRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { JsonSchemaFormComponent, JsonSchemaFormService } from '@ajsf/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';

import { environment } from '@xm-ngx/core/environment';
import { Principal } from '@xm-ngx/core/auth';
import { I18nNamePipe } from '@xm-ngx/components/language';
import { ExtSelectOptions, SelectDeepLinkOptions } from './ext-select-options.model';
import { ExtSelectService } from './ext-select-service';
import BaseExtSelectComponent from './base-ext-select.component';

interface Element {
    label: any;
    value: any;
}

@Component({
    selector: 'xm-ext-select-widget',
    templateUrl: 'ext-select.component.html',
    styles: [
        `
            :host .deep-link {
                vertical-align: middle;
            }

            :host .deep-link.disabled {
                opacity: .2;
                cursor:  not-allowed;
            }

            :host .deep-link.hidden {
                display: none;
            }
        `,
    ],
})
export class ExtSelectComponent extends BaseExtSelectComponent implements OnInit, OnDestroy, AfterViewInit {

    public options: ExtSelectOptions;
    public selectLinkOptions: SelectDeepLinkOptions;
    public canSeeLink: boolean;
    public elements: any = [];
    public elementCtrl: UntypedFormControl = new UntypedFormControl();
    public elementFilterCtrl: UntypedFormControl = new UntypedFormControl();
    public filteredElements: ReplaySubject<Element[]> = new ReplaySubject<Element[]>(1);
    public placeholder: BehaviorSubject<string>;

    @ViewChild('singleSelect', {static: false}) protected singleSelect: MatSelect;
    @Input() private layoutNode: any;
    protected controlValue: unknown;
    protected dataIndex: number[];

    constructor(
        @Inject(forwardRef(() => JsonSchemaFormComponent)) private _parent: JsonSchemaFormComponent,
        private jsf: JsonSchemaFormService,
        private selectService: ExtSelectService,
        private router: Router,
        private i18nNamePipe: I18nNamePipe,
        private changeDetectorRef: ChangeDetectorRef,
        private principal: Principal,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.selectLinkOptions = this.options.link || null;
        this.setCanSeeLink();
        if (!environment?.production) {
            // eslint-disable-next-line no-console
            console.debug('[dbg] initial -> %o', this.options);
        }
        this.jsf.initializeControl(this);
        if (this.layoutNode.dataType === 'array') {
            this.controlValue = this.controlValue[0];
        }

        this.placeholder = new BehaviorSubject<string>(this.options.title);
        this.filteredElements.subscribe((elements) => {
            if (!elements.length) {
                this.placeholder.next(this.options.emptyPlaceholder || this.options.title);
            } else {
                this.placeholder.next(this.options.title);
            }
        });
    }

    public ngAfterViewInit(): void {
        if (!this.options.url || !ExtSelectService.isTemplateUrl(this.options.url)) {
            this.fetchData(this.options);
            return;
        }

        this.fetchByLiteral();
    }

    public ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    public getParentJsf(): JsonSchemaFormService {
        return this._parent.jsf;
    }

    public getJsf(): JsonSchemaFormService {
        return this.jsf;
    }

    public initOptionList(): void {
        this.filteredElements.next(this.elements.slice());
        this.elementCtrl = this.elements.filter((e) => e.value === this.controlValue)[0];
        this.elementFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterElements();
            });
    }

    public updateValue(event: any): void {
        const item = this.elements.filter((e) => e.value === event.value.value)[0];
        const fg: UntypedFormGroup = this.jsf.formGroup;
        if (this.options.relatedFields) {
            this.options.relatedFields.forEach((field) => {
                const relativeControl = ExtSelectService.controlByKey(field.key, fg, this.dataIndex);
                if (relativeControl) {
                    const value = ExtSelectService.byString(item.object, field.value);
                    relativeControl.setValue(value);
                    relativeControl.updateValueAndValidity({emitEvent: true});
                }
            });
        }
        if (this.layoutNode.dataType === 'array') {
            this.jsf.updateValue(this, [item.value]);
        } else {
            if (event.value.value) {
                this.jsf.updateValue(this, item.value);
            } else {
                this.jsf.updateValue(this, '');
                this.singleSelect.writeValue('');
            }
        }
        this.controlValue = event.value.value;
    }

    public onNavigate(e: Event): void {
        e.stopPropagation();
        const entityObj = this.elementCtrl && this.elementCtrl['object'];
        const navigationId = entityObj && entityObj.id;
        const typeKey = entityObj && entityObj.typeKey;
        if (navigationId && typeKey) {
            this.router.navigate([`application/${typeKey}/${navigationId}`]);
        }
    }

    private filterElements(): void {
        if (!this.elements) {
            return;
        }
        let search = this.elementFilterCtrl.value;
        if (!search && search == null) {
            this.filteredElements.next(this.elements.slice());
            return;
        }
        search = search.toLowerCase();

        this.filteredElements.next(
            this.elements.filter((e) => e.label.toLowerCase().indexOf(search) > -1),
        );
    }

    protected fetchData(options: any): void {
        if (options.sourceField) {
            const array = new Function(
                'model', 'options', 'return ' + options.sourceField)(this.jsf.getData(), this.jsf.formOptions);
            this.elements = this.selectService.mapArrayToView(array, options);
            if (array !== false) {
                this.initOptionList();
                return;
            }
        }

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
            if (!this.options.url && !ExtSelectService.isTemplateUrl(this.options.url)) {
                return;
            }

            this.fetchOptions(options).pipe(
                tap((items) => !environment.production && console.info('[dbg] ext-select -> ', items)),
                tap((items) => this.elements = items),
                tap(() => this.initOptionList()),
                finalize(() => this.changeDetectorRef.detectChanges()),
            ).subscribe(
                () => {
                    if (this.controlValue) {
                        this.jsf.updateValue(this, this.controlValue);
                    }
                },
                (error) => console.warn(error));
        }
    }

    private fetchOptions(options: any): Observable<any[]> {
        return this.selectService.fetchData(options);
    }

    private setCanSeeLink(): void {
        const privileges = this.selectLinkOptions &&
            this.selectLinkOptions.privileges &&
            this.selectLinkOptions.privileges.length > 0;
        if (privileges) {
            this.principal.hasPrivileges(this.selectLinkOptions.privileges)
                .then(result => this.canSeeLink = result);
        } else {
            this.canSeeLink = this.selectLinkOptions && typeof this.selectLinkOptions === 'object';
        }
    }
}
