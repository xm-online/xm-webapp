import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnChanges, OnInit, Type, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { XM_COPY_ICON_OPTIONS, XmCopyIconModule, XmCopyIconOptions } from '@xm-ngx/components/copy/xm-copy-icon';
import {
    XM_LINK_VIEW_DEFAULT_OPTIONS,
    XmLinkViewOptions,
    XmLinkViewComponent,
} from '@xm-ngx/components/link/xm-link-view';
import { XmTextViewModule } from '@xm-ngx/components/xm-text-view';
import { IComponent } from '@xm-ngx/dynamic';
import { IId } from '@xm-ngx/shared/interfaces';
import { XmTranslationModule } from '@xm-ngx/translation';
import { assign, clone } from 'lodash';


export interface XmLinkViewCopyOptions extends XmLinkViewOptions {
    copy: XmCopyIconOptions;
}

export const XM_LINK_VIEW_COPY_DEFAULT_OPTIONS: XmLinkViewCopyOptions = assign(
    {},
    XM_LINK_VIEW_DEFAULT_OPTIONS,
    { copy: { template: '{{value.id}}', copiedMessage: XM_COPY_ICON_OPTIONS.copiedMessage } },
);

@Component({
    selector: 'xm-link-view-copy',
    template: `
        <xm-text [hidden]="!fieldValue"
                 [styleInline]="options?.styleInline">
            <span xmLabel>{{options?.title | translate}}</span>

            <div xmValue>
                <a [queryParams]="queryParams"
                   [routerLink]="options?.routerLink">
                    <span *ngIf="fieldTitle">{{fieldTitle | translate}}</span>
                    <span *ngIf="fieldValue">{{fieldValue}}</span>
                </a>
                <xm-copy-icon [value]="copyValue"
                              [options]="copyOptions"></xm-copy-icon>
            </div>
        </xm-text>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class XmLinkViewCopyComponent extends XmLinkViewComponent implements IComponent<IId, XmLinkViewOptions>, OnInit, OnChanges {
    @Input() public value: IId;
    @Input() public options: XmLinkViewCopyOptions;
    public copyValue: unknown;
    public copyOptions: XmCopyIconOptions;
    protected defaultOptions: XmLinkViewCopyOptions = clone(XM_LINK_VIEW_COPY_DEFAULT_OPTIONS);

    public update(): void {
        super.update();
        this.copyValue = this.value;
        this.copyOptions = assign({}, this.defaultOptions.copy, this.options?.copy);
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
        XmCopyIconModule,
    ],
})
export class XmLinkViewCopyModule {
    public entry: Type<XmLinkViewCopyComponent> = XmLinkViewCopyComponent;
}
