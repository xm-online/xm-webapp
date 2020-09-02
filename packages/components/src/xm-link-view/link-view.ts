import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnChanges, OnInit, Type, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LINK_DEFAULT_OPTIONS, LinkComponent, LinkOptions } from '@xm-ngx/components/xm-link-view/link';
import { XmTextViewModule } from '@xm-ngx/components/xm-text-view';
import { IComponent } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { assign, clone } from 'lodash';
import { IId } from '../entity-collection';

export interface LinkViewOptions extends LinkOptions {
    title: Translate;
    styleInline: boolean;
}

export const LINK_VIEW_DEFAULT_OPTIONS: LinkViewOptions = assign(
    {},
    LINK_DEFAULT_OPTIONS,
    {
        styleInline: false,
        title: '',
    },
);

@Component({
    selector: 'xm-link-view',
    template: `
        <xm-text [hidden]="!fieldValue" [styleInline]="options?.styleInline">
            <span xmLabel>{{options?.title | translate}}</span>

            <div xmValue>
                <a [queryParams]="queryParams"
                   [routerLink]="options?.routerLink">
                    <span>{{fieldValue}}</span>
                </a>
            </div>
        </xm-text>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class XmLinkViewComponent extends LinkComponent implements IComponent<IId, LinkViewOptions>, OnInit, OnChanges {
    @Input() public value: IId;
    @Input() public options: LinkViewOptions;
    protected defaultOptions: LinkViewOptions = clone(LINK_VIEW_DEFAULT_OPTIONS);

    public ngOnChanges(): void {
        super.ngOnChanges();
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }
}

@NgModule({
    declarations: [XmLinkViewComponent],
    exports: [XmLinkViewComponent],
    imports: [
        CommonModule,
        XmTextViewModule,
        XmTranslationModule,
        RouterModule,
    ],
})
export class XmLinkViewModule {
    public entry: Type<XmLinkViewComponent> = XmLinkViewComponent;
}
