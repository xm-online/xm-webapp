import { Component, Input, NgModule, Type } from '@angular/core';

export interface XmHtmlOptions {
    html: string,
}

@Component({
    selector: 'xm-html',
    template: '<div [innerHTML]="options?.html"></div>',
})
export class XmHtmlComponent {
    @Input() public options: XmHtmlOptions;
}

@NgModule({
    exports: [XmHtmlComponent],
    declarations: [XmHtmlComponent],
})
export class XmHtmlModule {
    public entry: Type<XmHtmlComponent> = XmHtmlComponent;
}
