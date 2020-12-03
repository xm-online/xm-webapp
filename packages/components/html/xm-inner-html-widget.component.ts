import { Component, Input, NgModule, Type } from '@angular/core';
import { XmHtmlModule, XmHtmlOptions } from './xm-html';

@Component({
    selector: 'xm-inner-html-widget',
    template: '<xm-html [options]="config"></xm-html>',
})
export class XmInnerHtmlWidget {
    @Input() public config: XmHtmlOptions;
}

@NgModule({
    exports: [XmInnerHtmlWidget],
    declarations: [XmInnerHtmlWidget],
    imports: [
        XmHtmlModule,
    ],
})
export class InnerHTMLModule {
    public entry: Type<XmInnerHtmlWidget> = XmInnerHtmlWidget;
}
