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
import { XM_BOOL_VIEW_ICONS, XmBoolOptions } from './xm-bool.injectors';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export type XmBoolValue = string | boolean;

const XM_BOOL_VIEW_ICONS_DEFAULT: XmBoolOptions = {
    true: 'done',
    false: 'remove',
};

@Component({
    selector: 'xm-bool-view, bool-value, xm-bool',
    template: `
        <mat-icon>{{ icon }}</mat-icon>
    `,
    imports: [MatIconModule, CommonModule],
    standalone: true,
    providers: [{ provide: XM_BOOL_VIEW_ICONS, useValue: XM_BOOL_VIEW_ICONS_DEFAULT }],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmBoolComponent implements OnInit, OnChanges {
    @Input() public value: XmBoolValue;
    public icon: string;
    private acceptableValue: Primitive[];

    constructor(@Inject(XM_BOOL_VIEW_ICONS) public icons: XmBoolOptions) {
    }

    @Input()
    public set config(value: { icons: XmBoolOptions, acceptableValue: Primitive[] }) {
        if (value?.icons) {
            this.icons = value.icons;
        }
        if (value?.acceptableValue) {
            if (Array.isArray(value.acceptableValue)) {
                this.acceptableValue = value.acceptableValue;
            } else {
                this.acceptableValue = [value.acceptableValue];
            }
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
        if (this.acceptableValue) {
            return this.icons[String(this.acceptableValue.includes(value))];
        }
        return this.icons[String(Boolean(value))];
    }
}
