import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnChanges, OnInit, Type, ViewEncapsulation } from '@angular/core';
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
    template: `
        <a [queryParams]="queryParams"
           [routerLink]="options?.routerLink || options?.options?.routerLink"
           [style]="options?.style || options?.options?.style">
            <mat-icon *ngIf="options?.valueIcon || options?.options?.valueIcon">{{options.valueIcon || options?.options?.valueIcon}}</mat-icon>
            <span *ngIf="fieldTitle">{{fieldTitle | translate}}</span>
            <span *ngIf="fieldValue">{{fieldValue}}</span>
        </a>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class XmLink implements XmDynamicPresentation<IId, XmLinkOptions>, OnInit, OnChanges {
    @Input() public value: IId;
    @Input() public options: XmLinkOptions & { options?: XmLinkOptions };
    public fieldTitle: Translate;
    public fieldValue: unknown;
    public queryParams: { [key: string]: unknown };
    protected defaultOptions: XmLinkOptions = clone(XM_LINK_DEFAULT_OPTIONS);

    public update(): void {
        if (!this.value) {
            return;
        }
        this.fieldValue = get(this.value, this.options?.valueField || this.options?.options?.valueField || this.defaultOptions.valueField, null);
        this.fieldTitle = this.options?.valueTitle || this.options?.options?.valueTitle;
        this.queryParams = transformByMap(this.value, this.options?.queryParamsFromEntityFields || this.options?.options?.queryParamsFromEntityFields || this.defaultOptions.queryParamsFromEntityFields);
    }

    public ngOnChanges(): void {
        this.update();
    }

    public ngOnInit(): void {
        this.update();
    }
}

@NgModule({
    declarations: [XmLink],
    exports: [XmLink],
    imports: [
        CommonModule,
        RouterModule,
        XmTranslationModule,
        MatIconModule,
    ],
})
export class XmLinkModule {
    public entry: Type<XmLink> = XmLink;
}
