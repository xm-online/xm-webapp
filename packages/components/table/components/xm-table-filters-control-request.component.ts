import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
    FiltersControlValue,
    XmTableFiltersControlComponent
} from '@xm-ngx/components/table/components/xm-table-filters-control.component';
import { FormLayoutItem } from '@xm-ngx/components/form-layout';

export interface XmTableFiltersControlRequestConfig {
    submitInvalidForm?: boolean;
    isOnlyExpand?: boolean;
    filters: FormLayoutItem[];
    filtersClass?: string;
    filterStoreKey?: string;
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
        XmTableFiltersControlComponent
    ]
})
export class XmTableFiltersControlRequestComponent implements OnChanges {
    @ViewChild(XmTableFiltersControlComponent)
    public filtersControl: XmTableFiltersControlComponent;

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
