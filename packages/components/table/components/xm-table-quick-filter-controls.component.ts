import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
    FiltersControlValue,
    XmTableFilterButtonDialogControlComponent
} from './xm-table-filter-button-dialog-control.component';
import { FormLayoutItem } from '@xm-ngx/components/form-layout';
import { JsonPipe } from '@angular/common';
import { XmTableQuickFilterControl } from '../components/xm-quick-filters-control.component';
import { MatChipsModule } from '@angular/material/chips';

export interface XmTableFiltersControlRequestConfig {
    submitInvalidForm?: boolean;
    isOnlyExpand?: boolean;
    filters: FormLayoutItem[];
    chips: FormLayoutItem[];
    filtersClass?: string;
    filterStoreKey?: string;
}

@Component({
    selector: 'xm-quick-filters-control-request',
    template: `
        <xm-quick-filters-control class="quick-filter-control" (valueChange)="OnValueChange($event)"
                                  (filtersChanged)="filtersChanged.emit($event)"
                                  [containerClass]="options?.filtersClass"
                                  [disabled]="disabled"
                                  (validStatusChange)="valid = $event"
                                  [options]="options?.quickFilters"
                                  [submitInvalidForm]="options?.submitInvalidForm"
                                  [value]="value">
        </xm-quick-filters-control>
    `,
    standalone: true,
    imports: [
        XmTableFilterButtonDialogControlComponent,
        JsonPipe,
        XmTableQuickFilterControl,
        MatChipsModule
    ]
})
export class XmTableQuickFilterControlsComponent implements OnChanges, OnInit {
    @ViewChild(XmTableFilterButtonDialogControlComponent)
    public filtersControl: XmTableFilterButtonDialogControlComponent;

    @Input() public request: FiltersControlValue;
    @Output() public requestChange: EventEmitter<FiltersControlValue> = new EventEmitter<FiltersControlValue>();
    @Output() public filtersChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input() public disabled: boolean;
    @Input() public loading: boolean;
    @Input() public options: any;

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

    public ngOnInit(): void {
        this.options;
    }

    private getRequest(values: FiltersControlValue): FiltersControlValue {
        if (!this.options?.filters) {
            return null;
        }

        return values;
    }

}
