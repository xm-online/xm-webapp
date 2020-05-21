import { Component, NgModule, Type } from '@angular/core';

@Component({
    selector: 'xm-innerHTML',
    template: '<div [innerHTML]="config.html"></div>',
})
export class InnerHTMLComponent {
    public config: { html: string };
}

@NgModule({
    imports: [],
    exports: [InnerHTMLComponent],
    declarations: [InnerHTMLComponent],
    providers: [],
})
export class InnerHTMLModule {
    public entry: Type<InnerHTMLComponent> = InnerHTMLComponent;
}
