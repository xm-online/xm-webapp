import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnChanges, OnInit, Type, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {
    XM_LINK_DEFAULT_OPTIONS,
    XmLinkOptions,
    XmLink,
    XmLinkModule
} from '@xm-ngx/components/link/xm-link';
import { XmTextViewModule } from '@xm-ngx/components/text';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { IId } from '@xm-ngx/shared/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { assign, clone } from 'lodash';

export interface XmLinkViewOptions extends XmLinkOptions {
    title: Translate;
    styleInline: boolean;
    icon?: string
}

export const XM_LINK_VIEW_DEFAULT_OPTIONS: XmLinkViewOptions = assign(
    {},
    XM_LINK_DEFAULT_OPTIONS,
    {
        styleInline: false,
        title: '',
        icon: null
    },
);

@Component({
    selector: 'xm-link-view',
    template: `
        <xm-text-view-container [hidden]="!fieldValue" [styleInline]="options?.styleInline">
            <span xmLabel>{{options?.title | translate}}</span>

            <div xmValue>
                <a [queryParams]="queryParams"
                   [routerLink]="options?.routerLink">
                    <span *ngIf="fieldTitle">{{fieldTitle | translate}}</span>
                    <span *ngIf="options?.valueField">{{fieldValue}}</span>
                    <mat-icon *ngIf="options?.icon">{{options.icon}}</mat-icon>
                </a>
            </div>
        </xm-text-view-container>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class XmLinkViewComponent extends XmLink implements XmDynamicPresentation<IId, XmLinkViewOptions>, OnInit, OnChanges {
    @Input() public value: IId;
    @Input() public options: XmLinkViewOptions;
    protected defaultOptions: XmLinkViewOptions = clone(XM_LINK_VIEW_DEFAULT_OPTIONS);
}

@NgModule({
    declarations: [XmLinkViewComponent],
    exports: [XmLinkViewComponent],
    imports: [
        CommonModule,
        XmTextViewModule,
        XmTranslationModule,
        RouterModule,
        MatIconModule,
        XmLinkModule
    ],
})
export class XmLinkViewModule {
    public entry: Type<XmLinkViewComponent> = XmLinkViewComponent;
}
