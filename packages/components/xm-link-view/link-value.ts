import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnChanges, OnInit, Type, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IComponent } from '@xm-ngx/dynamic';
import { IId } from '@xm-ngx/shared/interfaces';
import { transformByMap } from '@xm-ngx/shared/operators';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { clone, get } from 'lodash';

export interface LinkOptions {
    /** list of fields which will be transformed to queryParams */
    queryParamsFromEntityFields?: { [key: string]: string };
    /** string is field path or regular url */
    routerLink: string[];
    /** Set field text from configuration */
    valueTitle: Translate;
    /** Set field text from entity */
    valueField: string;
}

export const LINK_DEFAULT_OPTIONS: LinkOptions = {
    queryParamsFromEntityFields: { 'id': 'id' },
    routerLink: [],
    valueField: 'id',
    valueTitle: null,
};

@Component({
    selector: 'xm-link',
    template: `
        <a [queryParams]="queryParams"
           [routerLink]="options?.routerLink">
            <span *ngIf="fieldTitle">{{fieldTitle | translate}}</span>
            <span *ngIf="fieldValue">{{fieldValue}}</span>
        </a>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class LinkValue implements IComponent<IId, LinkOptions>, OnInit, OnChanges {
    @Input() public value: IId;
    @Input() public options: LinkOptions;
    public fieldTitle: Translate;
    public fieldValue: unknown;
    public queryParams: { [key: string]: unknown };
    protected defaultOptions: LinkOptions = clone(LINK_DEFAULT_OPTIONS);

    public update(): void {
        if (!this.value) {
            return;
        }
        this.fieldValue = get(this.value, this.options?.valueField || this.defaultOptions.valueField, null);
        this.fieldTitle = this.options?.valueTitle;
        this.queryParams = transformByMap(this.value, this.options?.queryParamsFromEntityFields || this.defaultOptions.queryParamsFromEntityFields);
    }

    public ngOnChanges(): void {
        this.update();
    }

    public ngOnInit(): void {
        this.update();
    }
}

@NgModule({
    declarations: [LinkValue],
    exports: [LinkValue],
    imports: [
        CommonModule,
        RouterModule,
        XmTranslationModule,
    ],
})
export class LinkValueModule {
    public entry: Type<LinkValue> = LinkValue;
}
