import { Component, Input, NgModule, Type } from '@angular/core';

@Component({
    selector: 'xm-inner-html-widget',
    template: '<div [innerHTML]="config.html"></div>',
})
export class XmInnerHtmlWidget {
   @Input() public config: { html: string };
}

@NgModule({
    exports: [XmInnerHtmlWidget],
    declarations: [XmInnerHtmlWidget],
})
export class InnerHTMLModule {
    public entry: Type<XmInnerHtmlWidget> = XmInnerHtmlWidget;
}
