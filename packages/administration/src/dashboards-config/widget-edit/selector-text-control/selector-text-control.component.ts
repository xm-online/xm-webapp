import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
    ExtendedDynamicComponents,
    WidgetListService,
} from '@xm-ngx/administration/dashboards-config/widget-edit/widget-list.service';
import { NgModelWrapper } from '@xm-ngx/components/ng-model-wrapper';
import { ITextControlOptions } from '@xm-ngx/components/xm-text-control';
import { IControl } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';

@Component({
    selector: 'xm-selector-text-control',
    templateUrl: './selector-text-control.component.html',
    styleUrls: ['./selector-text-control.component.scss'],
    providers: [
        WidgetListService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectorTextControlComponent),
            multi: true,
        },
    ],
})
export class SelectorTextControlComponent
    extends NgModelWrapper<string>
    implements IControl<string, ITextControlOptions>, OnInit {
    @Input() public value: string;
    @Input() public disabled: boolean;
    @Output() public valueChange: EventEmitter<string> = new EventEmitter<string>();
    @Input() public options: ITextControlOptions;
    public control: FormControl = new FormControl(this.value);
    public filteredOptions: Observable<ExtendedDynamicComponents[]>;

    constructor(private widgetListService: WidgetListService) {
        super();
    }

    public ngOnInit(): void {
        const widgets$ = this.widgetListService.widgets$.pipe(shareReplay(1));
        this.filteredOptions = combineLatest(
            this.control.valueChanges.pipe(startWith('')),
            widgets$,
        ).pipe(
            map(([value, arr]) => this.filter(value, arr)),
        );
    }

    public writeValue(obj: string): void {
        super.writeValue(obj);
        if (obj && this.value !== this.control.value) {
            this.control.patchValue(this.value);
        }
    }

    private filter(value: string, arr: ExtendedDynamicComponents[]): ExtendedDynamicComponents[] {
        const filterValue = value.toLowerCase();
        return arr.filter(option => option.globalSelector?.toLowerCase().includes(filterValue));
    }
}

import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        CommonModule,
        XmTranslationModule,
        MatInputModule,
    ],
    exports: [SelectorTextControlComponent],
    declarations: [SelectorTextControlComponent],
})
export class WidgetSelectorTextControlModule {
}
