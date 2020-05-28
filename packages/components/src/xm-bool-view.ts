import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
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
        <mat-icon>{{ getIcon(value) }}</mat-icon>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class BoolViewComponent implements IComponent<BoolValue, BoolOptions> {
    @Input() public value: BoolValue;
    @Input() public options: BoolOptions = ICONS;

    public getIcon(value: boolean | string): string {
        return this.options[String(value)];
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
