import { Component, Input, NgModule, Type } from '@angular/core';
import { Translate, XmTranslateService } from '@xm-ngx/translation';

export interface XmHtmlOptions {
    html: Translate,
}

@Component({
    selector: 'xm-html',
    template: '<div [innerHTML]="html"></div>',
})
export class XmHtmlComponent {
    public html: string;

    constructor(private translationService: XmTranslateService) {
    }

    private _options: XmHtmlOptions;

    public get options(): XmHtmlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmHtmlOptions) {
        this._options = value;
        this.html = this.translationService.translate(this._options?.html);
    }
}

@NgModule({
    exports: [XmHtmlComponent],
    declarations: [XmHtmlComponent],
})
export class XmHtmlModule {
    public entry: Type<XmHtmlComponent> = XmHtmlComponent;
}
