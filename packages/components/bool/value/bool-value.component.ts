import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { BoolOptions, XM_BOOL_VIEW_ICONS } from './bool-value.injectors';

export type BoolValue = string | boolean;

@Component({
    selector: 'xm-bool-view, bool-value, xm-bool',
    template: `
        <mat-icon>{{ icon }}</mat-icon>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class BoolValueComponent implements OnInit, OnChanges {
    @Input() public value: BoolValue;
    public icon: string;

    constructor(@Inject(XM_BOOL_VIEW_ICONS) public icons: BoolOptions) {
    }

    @Input()
    public set options(value: { icons: BoolOptions }) {
        if (value.icons) {
            this.icons = value.icons;
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!changes.value.firstChange) {
            this.icon = this.getIcon(this.value);
        }
    }

    public ngOnInit(): void {
        this.icon = this.getIcon(this.value);
    }

    private getIcon(value: boolean | string | undefined): string {
        if (value === 'false') {
            value = false;
        }
        return this.icons[String(Boolean(value))];
    }
}
