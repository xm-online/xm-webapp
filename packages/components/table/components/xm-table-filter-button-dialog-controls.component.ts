import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
    FiltersControlValue,
    XmTableFilterButtonDialogControlComponent
} from './xm-table-filter-button-dialog-control.component';
import { FormLayoutItem } from '@xm-ngx/components/form-layout';

export interface XmTableFiltersControlRequestConfig {
    submitInvalidForm?: boolean;
    isOnlyExpand?: boolean;
    filters: FormLayoutItem[];
    chips: FormLayoutItem[];
    filtersClass?: string;
    filterStoreKey?: string;
    quickFilters?: FormLayoutItem[];
    hideDefaultFilters?: boolean;
}

@Component({
    selector: 'xm-filters-control-request',
    template: `
        <xm-filters-control (valueChange)="OnValueChange($event)"
                            (filtersChanged)="filtersChanged.emit($event)"
                            [containerClass]="options?.filtersClass"
                            [disabled]="disabled"
                            (validStatusChange)="valid = $event"
                            [options]="options?.filters"
                            [submitInvalidForm]="options?.submitInvalidForm"
                            [value]="value">
        </xm-filters-control>
    `,
    standalone: true,
    imports: [
        XmTableFilterButtonDialogControlComponent
    ]
})
export class XmTableFilterButtonDialogControlsComponent implements OnChanges {
    @ViewChild(XmTableFilterButtonDialogControlComponent)
    public filtersControl: XmTableFilterButtonDialogControlComponent;

    @Input() public request: FiltersControlValue;
    @Output() public requestChange: EventEmitter<FiltersControlValue> = new EventEmitter<FiltersControlValue>();
    @Output() public filtersChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input() public disabled: boolean;
    @Input() public loading: boolean;
    @Input() public options: XmTableFiltersControlRequestConfig;

    public value: FiltersControlValue;
    public valid: boolean = true;

    public OnValueChange(value: FiltersControlValue): void {
        this.request = this.getRequest(value);
        this.requestChange.emit(this.request);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.request) {
            this.value = this.request;
        }
    }

    private getRequest(values: FiltersControlValue): FiltersControlValue {
        if (!this.options?.filters) {
            return null;
        }

        return values;
    }

}
