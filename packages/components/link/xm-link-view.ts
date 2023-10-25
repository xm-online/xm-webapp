import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { XmTextViewModule } from '@xm-ngx/components/text';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { IId } from '@xm-ngx/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { assign, clone } from 'lodash';
import { XM_LINK_DEFAULT_OPTIONS, XmLink, XmLinkOptions } from './xm-link';

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
        icon: null,
    },
);

@Component({
    selector: 'xm-link-view',
    standalone: true,
    imports: [
        CommonModule,
        XmTextViewModule,
        XmTranslationModule,
        RouterModule,
        MatIconModule,
        XmLink,
    ],
    template: `
        <xm-text-view-container [hidden]="!fieldValue" [styleInline]="config?.styleInline">
            <span xmLabel>{{config?.title | translate}}</span>

            <div xmValue>
                <a [queryParams]="queryParams"
                   [routerLink]="config?.routerLink">
                    <span *ngIf="fieldTitle">{{fieldTitle | translate}}</span>
                    <span *ngIf="config?.valueField">{{fieldValue}}</span>
                    <mat-icon *ngIf="config?.icon">{{config.icon}}</mat-icon>
                </a>
            </div>
        </xm-text-view-container>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class XmLinkViewComponent extends XmLink implements XmDynamicPresentation<IId, XmLinkViewOptions>, OnInit, OnChanges {
    @Input() public declare value: IId;
    @Input() public declare config: XmLinkViewOptions & {config?: XmLinkOptions};
    protected defaultOptions: XmLinkViewOptions = clone(XM_LINK_VIEW_DEFAULT_OPTIONS);
}
