import { Component, Input } from '@angular/core';
import { XmTextTitleOptions } from '../text-title';
import { XmDynamicModule, XmDynamicPresentation, } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmTextViewModule } from '../text-view/xm-text-view.component';
import { NgForOf, NgIf } from '@angular/common';
import { XmEmptyPipe } from '@xm-ngx/pipes';

export interface XmTextDynamicOptions extends XmTextTitleOptions {
    textStyle?: 'inline';
    valueStyleInline?: string;
    labelStyleInline?: string;
    selector: string;
    options: unknown;
    emptyValue?: Translate;
    dynamicLabel?: (XmTextTitleOptions & XmDynamicPresentation)[];
}

@Component({
    selector: 'xm-text-dynamic-view',
    template: `
        <xm-text-view-container [styleInline]="config?.textStyle === 'inline'"
                                [valueStyleInline]="config?.valueStyleInline"
                                [labelStyleInline]="config?.labelStyleInline">
            <div xmLabel *ngIf="config?.dynamicLabel && !config.title" class="d-flex align-items-center">
                <ng-container
                    *ngFor="let layout of config?.dynamicLabel"
                    xmDynamicPresentation
                    [selector]="layout.selector"
                    [value]="layout.title | translate"
                    [config]="layout.config"
                    [style]="layout.style"
                    [class]="layout.class"
                    [controllers]="layout.controllers"
                ></ng-container>
            </div>

            <span xmLabel *ngIf="config.title">{{ config.title | translate }}</span>

            <span *ngIf="!(value | xmEmpty)"
                  xmValue
                  xmDynamicPresentation
                  [selector]="config.selector"
                  [value]="value"
                  [config]="config.options"
                  [options]="config.options"></span>

            <span xmValue *ngIf="(value | xmEmpty) && !(config?.emptyValue | xmEmpty)">
                {{ config.emptyValue | translate }}
            </span>
        </xm-text-view-container>
    `,
    imports: [XmTranslationModule, XmTextViewModule, XmDynamicModule, XmEmptyPipe, NgIf, NgForOf],
    standalone: true,
})
export class XmTextDynamicView implements XmDynamicPresentation<Primitive, XmTextDynamicOptions> {
    @Input() public value: Primitive;
    @Input() public config: XmTextDynamicOptions;
}
