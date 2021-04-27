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
import { XmBoolOptions, XM_BOOL_VIEW_ICONS } from './xm-bool.injectors';

export type XmBoolValue = string | boolean;

@Component({
    selector: 'xm-bool-view, bool-value, xm-bool',
    template: `
        <mat-icon>{{ icon }}</mat-icon>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmBoolComponent implements OnInit, OnChanges {
    @Input() public value: XmBoolValue;
    public icon: string;

    constructor(@Inject(XM_BOOL_VIEW_ICONS) public icons: XmBoolOptions) {
    }

    @Input()
    public set options(value: { icons: XmBoolOptions }) {
        if (value?.icons) {
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
