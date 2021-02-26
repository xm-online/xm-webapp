import { Directive, Input, NgModule, Self } from '@angular/core';
import { XmCodeContainerComponent } from '@xm-ngx/components/code';

@Directive({ selector: '[xmCodeContainerJson]' })
export class XmCodeContainerJsonDirective {
    constructor(@Self() private xmCodeContainerComponent: XmCodeContainerComponent) {
    }

    private _isFormatted: boolean = false;

    public get isFormatted(): boolean {
        return this._isFormatted;
    }

    @Input('isFormatted')
    public set isFormatted(value: boolean | undefined) {
        this._isFormatted = value !== false;
        this.update();
    }

    private _xmCodeContainerJson: object;

    public get xmCodeContainerJson(): object {
        return this._xmCodeContainerJson;
    }

    @Input('xmCodeContainerJson')
    public set xmCodeContainerJson(value: object) {
        this._xmCodeContainerJson = value;
        this.update();
    }

    private update(): void {
        if (this._xmCodeContainerJson) {
            const space = this.isFormatted ? 2 : 0;
            this.xmCodeContainerComponent.copyValue = JSON.stringify(this._xmCodeContainerJson, null, space);
        }
    }
}


@NgModule({
    imports: [],
    exports: [XmCodeContainerJsonDirective],
    declarations: [XmCodeContainerJsonDirective],
})
export class XmCodeContainerJsonModule {
}
