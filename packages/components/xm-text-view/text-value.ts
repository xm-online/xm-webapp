import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { IComponent, IComponentFn } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';

@Component({
    selector: 'xm-text-value',
    template: `{{value}}`,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class TextValue implements IComponent<Primitive, undefined> {
    @Input() public value: Primitive;
    @Input() public options: undefined;
}

@NgModule({
    exports: [TextValue],
    declarations: [TextValue],
})
export class TextValueModule {
    public entry: IComponentFn<Primitive, undefined> = TextValue;
}
