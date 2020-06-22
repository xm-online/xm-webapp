import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IComponent, IComponentFn } from '@xm-ngx/dynamic';

type BoolValue = string | boolean;

interface BoolOptions {
    true: string;
    false: string;
}

const ICONS: BoolOptions = {
    true: 'done',
    false: 'remove',
};

@Component({
    selector: 'xm-bool-view',
    template: `
        <mat-icon>{{ icon }}</mat-icon>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class BoolViewComponent implements OnInit, OnChanges, IComponent<BoolValue, BoolOptions> {
    @Input() public value: BoolValue;
    @Input() public options: BoolOptions = ICONS;

    public icon: string;

    public ngOnChanges(changes: SimpleChanges): void {
        if (!changes.value.firstChange) {
            this.icon = this.getIcon(this.value);
        }
    }

    public ngOnInit(): void {
        this.icon = this.getIcon(this.value);
    }

    private getIcon(value: boolean | string): string {
        if (value === 'false') {
            value = false;
        }
        return this.options[String(Boolean(value))];
    }
}

@NgModule({
    imports: [MatIconModule],
    exports: [BoolViewComponent],
    declarations: [BoolViewComponent],
    providers: [],
})
export class XmBoolViewModule {
    public entry: IComponentFn<BoolValue, BoolOptions> = BoolViewComponent;
}
