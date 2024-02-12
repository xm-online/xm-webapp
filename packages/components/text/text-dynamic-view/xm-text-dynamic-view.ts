import { Component, Input } from '@angular/core';
import { XmTextTitleOptions } from '../text-title';
import { XmDynamicModule, XmDynamicPresentation, } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmTextViewModule } from '../text-view/xm-text-view.component';
import { XmNotEmptyPipe } from '@xm-ngx/pipes';

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
        <xm-text-view-container
            [styleInline]="config?.textStyle === 'inline'"
            [valueStyleInline]="config?.valueStyleInline"
            [labelStyleInline]="config?.labelStyleInline">
            <div xmLabel>
                @if (config?.dynamicLabel && !config.title) {
                    <div class="d-flex align-items-center">
                        @for (layout of config?.dynamicLabel; track index; let index = $index) {
                            <ng-container
                                xmDynamicPresentation
                                [selector]="layout.selector"
                                [value]="layout.title | translate"
                                [config]="layout.config"
                                [style]="layout.style"
                                [class]="layout.class"
                                [controllers]="layout.controllers"
                            ></ng-container>
                        }
                    </div>
                }
            </div>

            <span xmLabel>
                @if (config.title) {
                    {{ config.title | translate }}
                }
            </span>

            <div xmValue>
                @if ((value === true || value === false) || (value | xmNotEmpty)) {
                    <span
                        xmDynamicPresentation
                        [selector]="config.selector"
                        [value]="value"
                        [config]="config.options"
                        [options]="config.options"></span>
                } @else if (config?.emptyValue | xmNotEmpty) {
                    <span>
                        {{ config.emptyValue | translate }}
                    </span>
                }
            </div>
        </xm-text-view-container>
    `,
    imports: [XmTranslationModule, XmTextViewModule, XmDynamicModule, XmNotEmptyPipe],
    standalone: true,
})
export class XmTextDynamicView implements XmDynamicPresentation<Primitive, XmTextDynamicOptions> {
    @Input() public value: Primitive;
    @Input() public config: XmTextDynamicOptions;
}
