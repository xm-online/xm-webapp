import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
    ExtendedDynamicComponents,
    WidgetListService,
} from '@xm-ngx/administration/dashboards-config/widget-edit/widget-list.service';
import { NgModelWrapper } from '@xm-ngx/components/ng-model-wrapper';
import { ITextControlOptions } from '@xm-ngx/components/xm-text-control';
import { IControl } from '@xm-ngx/dynamic';
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
