import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { QueryParamsHandling, RouterModule } from '@angular/router';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { DataQa, IId } from '@xm-ngx/interfaces';
import { flattenObjectDeep, interpolate, transformByMap } from '@xm-ngx/operators';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { clone, get, isString } from 'lodash';

export interface XmLinkOptions extends DataQa {
    /** list of fields which will be transformed to queryParams */
    queryParamsFromEntityFields?: { [key: string]: string };
    /** list of fields which will fill statically queryParams */
    staticQueryParams?: { [key: string]: string };
    /** string is field path or regular url */
    routerLink: string[] | string;
    /** Set field text from configuration */
    valueTitle: Translate;
    /** Set field text from entity */
    valueField: string;
    /** Material icon */
    valueIcon: string;
    style?: string;
    newWindow?: boolean;
    /** See Angular queryParamsHandling routerLink parameter for more details https://next.angular.dev/api/router/QueryParamsHandling */
    queryParamsHandling?: QueryParamsHandling | null;
    isIconOnRight?: boolean;
    /** For cases when we need to choose RouterLink based on properties */
    dynamicRouterLink?: {
        switchValue: string,
        options: Record<string, string>
    };
}

export const XM_LINK_DEFAULT_OPTIONS: XmLinkOptions = {
    queryParamsFromEntityFields: { 'id': 'id' },
    routerLink: [],
    valueField: 'id',
    valueTitle: null,
    valueIcon: null,
    queryParamsHandling: null,
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
           [routerLink]="routerLink"
           [queryParamsHandling]="config?.queryParamsHandling"
           [target]="config?.newWindow ? '_blank' : '_self'"
           [style]="config?.style || config?.config?.style"
           [attr.data-qa]="config?.dataQa || 'xm-link-default-data-qa'"
        >
            <mat-icon *ngIf="!config?.isIconOnRight && (config?.valueIcon || config?.config?.valueIcon)">{{config.valueIcon || config?.config?.valueIcon}}</mat-icon>
            <span *ngIf="fieldTitle">{{fieldTitle | translate}}</span>
            <span *ngIf="fieldValue">{{fieldValue}}</span>
            <mat-icon *ngIf="config?.isIconOnRight && (config?.valueIcon || config?.config?.valueIcon)">{{config.valueIcon || config?.config?.valueIcon}}</mat-icon>
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
    public routerLink: string[] | string;
    protected defaultOptions: XmLinkOptions = clone(XM_LINK_DEFAULT_OPTIONS);

    public update(): void {
        if (!this.value) {
            return;
        }

        const queryParamsFromEntityFields = transformByMap<IId, object, object>(this.value, this.config?.queryParamsFromEntityFields || this.config?.config?.queryParamsFromEntityFields || this.defaultOptions.queryParamsFromEntityFields);

        this.fieldValue = get(this.value, this.config?.valueField || this.config?.config?.valueField || this.defaultOptions.valueField, null);
        this.fieldTitle = this.config?.valueTitle || this.config?.config?.valueTitle;
        this.queryParams = {
            ...this.config?.staticQueryParams,
            ...flattenObjectDeep(queryParamsFromEntityFields, ''),
        };

        const routerLink = this.config?.routerLink || this.config?.config?.routerLink;

        this.routerLink = isString(routerLink) ? interpolate(routerLink, {
            value: this.value,
        }) : routerLink;

        const { dynamicRouterLink } = this.config;
        if (!dynamicRouterLink) return;

        const key = get(this.value, dynamicRouterLink.switchValue) as string;
        this.routerLink = dynamicRouterLink.options?.[key] ?? this.routerLink;
    }

    public ngOnChanges(): void {
        this.update();
    }

    public ngOnInit(): void {
        this.update();
    }
}
