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
import { BoolOptions, XM_BOOL_VIEW_ICONS } from './xm-bool-view.injectors';

export type BoolValue = string | boolean;

@Component({
    selector: 'xm-bool-view',
    template: `
        <mat-icon>{{ icon }}</mat-icon>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class BoolViewComponent implements OnInit, OnChanges {
    @Input() public value: BoolValue;
    @Input() public options: BoolOptions;
    public icon: string;

    constructor(@Inject(XM_BOOL_VIEW_ICONS) icons: BoolOptions) {
        this.options = icons;
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
        return this.options[String(Boolean(value))];
    }
}
