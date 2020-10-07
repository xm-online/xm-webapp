import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnChanges, OnInit, Type, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { COPY_ICON_OPTIONS, CopyIconModule, CopyIconOptions } from '@xm-ngx/components/copy/copy-icon';
import {
    LINK_VIEW_DEFAULT_OPTIONS,
    LinkViewOptions,
    XmLinkViewComponent,
} from '@xm-ngx/components/xm-link-view/link-view';
import { XmTextViewModule } from '@xm-ngx/components/xm-text-view';
import { IComponent } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { assign, clone } from 'lodash';
import { IId } from '../entity-collection';

export interface LinkViewCopyOptions extends LinkViewOptions {
    copy: CopyIconOptions;
}

export const LINK_VIEW_COPY_DEFAULT_OPTIONS: LinkViewCopyOptions = assign(
    {},
    LINK_VIEW_DEFAULT_OPTIONS,
    { copy: { template: '${value.id}', copiedMessage: COPY_ICON_OPTIONS.copiedMessage } },
);

@Component({
    selector: 'xm-link-view',
    template: `
        <xm-text [hidden]="!fieldValue"
                 [styleInline]="options?.styleInline">
            <span xmLabel>{{options?.title | translate}}</span>

            <div xmValue>
                <a [queryParams]="queryParams"
                   [routerLink]="options?.routerLink">
                    <span>{{fieldValue}}</span>
                </a>
                <copy-icon [value]="copyValue"
                           [options]="copyOptions"></copy-icon>
            </div>
        </xm-text>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class XmLinkViewCopyComponent extends XmLinkViewComponent implements IComponent<IId, LinkViewOptions>, OnInit, OnChanges {
    @Input() public value: IId;
    @Input() public options: LinkViewCopyOptions;
    public copyValue: unknown;
    public copyOptions: CopyIconOptions;
    protected defaultOptions: LinkViewCopyOptions = clone(LINK_VIEW_COPY_DEFAULT_OPTIONS);

    public update(): void {
        super.update();
        this.copyValue = this.value;
        this.copyOptions = assign({}, this.defaultOptions.copy, this.options.copy);
    }

    public ngOnChanges(): void {
        super.ngOnChanges();
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }
}

@NgModule({
    declarations: [XmLinkViewCopyComponent],
    exports: [XmLinkViewCopyComponent],
    imports: [
        CommonModule,
        XmTextViewModule,
        XmTranslationModule,
        RouterModule,
        CopyIconModule,
    ],
})
export class XmLinkViewCopyModule {
    public entry: Type<XmLinkViewCopyComponent> = XmLinkViewCopyComponent;
}
