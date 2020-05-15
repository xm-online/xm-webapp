import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type BoolValue = string | boolean;

const ICONS: { [key: string]: string } = {
    true: 'done',
    false: 'remove',
};

@Component({
    selector: 'xm-bool',
    template: `
        <mat-icon>{{ getIcon(value) }}</mat-icon>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class BoolComponent {
    @Input() public value: BoolValue;

    public getIcon(value: boolean | string): string {
        return ICONS[String(value)];
    }
}

@NgModule({
    imports: [
        MatIconModule,
    ],
    exports: [BoolComponent],
    declarations: [BoolComponent],
    providers: [],
})
export class BoolModule {
}
