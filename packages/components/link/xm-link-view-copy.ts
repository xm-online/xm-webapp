import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { XM_COPY_ICON_OPTIONS, XmCopyIconComponent, XmCopyIconOptions } from '@xm-ngx/components/copy';
import {
    XM_LINK_VIEW_DEFAULT_OPTIONS,
    XmLinkViewOptions,
    XmLinkViewComponent,
} from './xm-link-view';
import { XmTextViewModule } from '@xm-ngx/components/text';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { IId } from '@xm-ngx/interfaces';
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
    standalone: true,
    imports: [
        CommonModule,
        XmTextViewModule,
        XmTranslationModule,
        RouterModule,
        XmCopyIconComponent,
    ],
    template: `
        <xm-text-view-container [hidden]="!fieldValue"
                                [styleInline]="config?.styleInline">
            <span xmLabel>{{config?.title | translate}}</span>

            <div xmValue>
                <a [queryParams]="queryParams"
                   [routerLink]="config?.routerLink">
                    <span *ngIf="fieldTitle">{{fieldTitle | translate}}</span>
                    <span *ngIf="fieldValue">{{fieldValue}}</span>
                </a>
                <xm-copy-icon [value]="copyValue"
                              [config]="copyOptions"></xm-copy-icon>
            </div>
        </xm-text-view-container>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class XmLinkViewCopyComponent extends XmLinkViewComponent implements XmDynamicPresentation<IId, XmLinkViewOptions>, OnInit, OnChanges {
    @Input() public value: IId;
    @Input() public config: XmLinkViewCopyOptions;
    public copyValue: unknown;
    public copyOptions: XmCopyIconOptions;
    protected defaultOptions: XmLinkViewCopyOptions = clone(XM_LINK_VIEW_COPY_DEFAULT_OPTIONS);

    public update(): void {
        super.update();
        this.copyValue = this.value;
        this.copyOptions = assign({}, this.defaultOptions.copy, this.config?.copy);
    }

    public ngOnChanges(): void {
        super.ngOnChanges();
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }
}
