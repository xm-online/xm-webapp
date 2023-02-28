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

    private _config: XmHtmlOptions;

    public get config(): XmHtmlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmHtmlOptions) {
        this._config = value;
        this.html = this.translationService.translate(this.config?.html);
    }
}

@NgModule({
    exports: [XmHtmlComponent],
    declarations: [XmHtmlComponent],
})
export class XmHtmlModule {
    public entry: Type<XmHtmlComponent> = XmHtmlComponent;
}
