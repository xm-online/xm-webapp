import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { IId } from '@xm-ngx/shared/interfaces';
import { transformByMap } from '@xm-ngx/shared/operators';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { clone, get } from 'lodash';

export interface XmLinkOptions {
    /** list of fields which will be transformed to queryParams */
    queryParamsFromEntityFields?: { [key: string]: string };
    /** string is field path or regular url */
    routerLink: string[] | string;
    /** Set field text from configuration */
    valueTitle: Translate;
    /** Set field text from entity */
    valueField: string;
    /** Material icon */
    valueIcon: string;
    style?: string;
}

export const XM_LINK_DEFAULT_OPTIONS: XmLinkOptions = {
    queryParamsFromEntityFields: {'id': 'id'},
    routerLink: [],
    valueField: 'id',
    valueTitle: null,
    valueIcon: null,
};

@Component({
    selector: 'xm-link',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        XmTranslationModule,
        MatIconModule,
    ],
    template: `
        <a [queryParams]="queryParams"
           [routerLink]="config?.routerLink || config?.config?.routerLink"
           [style]="config?.style || config?.config?.style">
            <mat-icon *ngIf="config?.valueIcon || config?.config?.valueIcon">{{config.valueIcon || config?.config?.valueIcon}}</mat-icon>
            <span *ngIf="fieldTitle">{{fieldTitle | translate}}</span>
            <span *ngIf="fieldValue">{{fieldValue}}</span>
        </a>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class XmLink implements XmDynamicPresentation<IId, XmLinkOptions>, OnInit, OnChanges {
    @Input() public value: IId;
    @Input() public config: XmLinkOptions & { config?: XmLinkOptions };
    public fieldTitle: Translate;
    public fieldValue: unknown;
    public queryParams: { [key: string]: unknown };
    protected defaultOptions: XmLinkOptions = clone(XM_LINK_DEFAULT_OPTIONS);

    public update(): void {
        if (!this.value) {
            return;
        }
        this.fieldValue = get(this.value, this.config?.valueField || this.config?.config?.valueField || this.defaultOptions.valueField, null);
        this.fieldTitle = this.config?.valueTitle || this.config?.config?.valueTitle;
        this.queryParams = transformByMap(this.value, this.config?.queryParamsFromEntityFields || this.config?.config?.queryParamsFromEntityFields || this.defaultOptions.queryParamsFromEntityFields);
    }

    public ngOnChanges(): void {
        this.update();
    }

    public ngOnInit(): void {
        this.update();
    }
}
