import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormLayoutItem, XmFormLayoutControl } from '@xm-ngx/components/form-layout';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'xm-table-filter-control-as-chip',
    template: `
        <xm-form-layout-control class="xm-appearance-control"
                                [config]="config"
                                [control]="control"></xm-form-layout-control>
    `,
    standalone: true,
    styles: [`
        /* TODO:WORKAROUND: Override material styles to inline styles. */
        :host .xm-appearance-control ::ng-deep * {
            pointer-events: none !important;
        }

        /* TODO:WORKAROUND: Override material styles to inline styles. */
        :host .xm-appearance-control ::ng-deep .mdc-text-field--filled {
            background-color: transparent !important;
        }

        /* TODO:WORKAROUND: Override material styles to inline styles. */
        :host .xm-appearance-control ::ng-deep .mat-mdc-form-field-infix {
            display: inline !important;
            white-space: nowrap !important;
            width: fit-content !important;
        }

        /* TODO:WORKAROUND: Override material styles to inline styles. */
        :host .xm-appearance-control ::ng-deep .mat-mdc-form-field-infix > * {
            display: inline !important;
            transform: none !important;
            position: unset !important;
        }
    `],
    imports: [
        XmFormLayoutControl,
    ],
})
export class XmTableFilterControlAsChipComponent implements OnChanges {
    @Input() public config: FormLayoutItem;
    @Input() public value: unknown;
    public control: FormControl<unknown>;

    public ngOnChanges(_: SimpleChanges): void {
        this.control = new FormControl<unknown>(this.value);
        this.control.disable();
    }
}
