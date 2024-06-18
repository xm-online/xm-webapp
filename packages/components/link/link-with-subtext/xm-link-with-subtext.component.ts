import { Component, inject, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { XmDynamicModule, XmDynamicPresentation } from '@xm-ngx/dynamic';
import { XmLinkSubtextConfig, XmLinkValueFormat, XmLinkWithSubtextDynamicWidget } from '../xm-link.model';
import { Primitive } from '@xm-ngx/interfaces';
import { cloneDeep, get, set } from 'lodash';
import { XmLink } from '../xm-link';

/**
 * Use this component for the case when you want to show link that has subtext.
 * For example, date that should be as a link and as a subtext has time.
 *
 * This component also can format the date that you want show as a link (see `this.config.linkConfig.format` property)
 *
 * ## Selector
 * `@xm-ngx/components/xm-link-with-subtext`
 *
 * ## Widget configuration (example as table column)
 * ```json
 * {
 *   "name": "date",
 *   "title": {
 *     "uk": "Date",
 *     "en": "Дата"
 *   },
 *   "selector": "@xm-ngx/components/xm-link-with-subtext",
 *   "config": {
 *     "linkConfig": {
 *       "valueField": "path.to.the.value",
 *       "routerLink": "path-to-your-page",
 *       "format": {
 *         "type": "date",
 *         "pattern": "dd.MM.yyyy"
 *       }
 *     },
 *     "subtext": {
 *       "field": "path.to.the.value",
 *       "selector": "@xm-ngx/components/date",
 *       "config": {
 *         "format": "HH:mm:ss"
 *       }
 *     }
 *   },
 *   "theme": {
 *     "class": "d-flex flex-column"
 *   },
 *   "sticky": false,
 *   "sortable": true
 * }
 * ```
 */
@Component({
    selector: 'xm-link-with-subtext',
    standalone: true,
    imports: [
        XmLink,
        XmDynamicModule,
    ],
    templateUrl: './xm-link-with-subtext.component.html',
    styleUrl: './xm-link-with-subtext.component.scss',
})
export class LinkWithSubtextComponent implements XmDynamicPresentation<unknown, XmLinkSubtextConfig>, OnInit {
    /** Value that pass from `packages/dynamic/operators/set-component-input.ts` */
    @Input() public value: unknown;
    /** Configuration that pass from `packages/dynamic/operators/set-component-input.ts` */
    @Input() public config: XmLinkSubtextConfig;
    public subLayout: XmLinkWithSubtextDynamicWidget;
    public subLayoutValue: Primitive;
    public formattedValue: unknown;

    private datePipe: DatePipe = inject(DatePipe);

    public ngOnInit(): void {
        this.cloneValue();
        this.assignSubLayout();
        this.formatValue();
    }

    private cloneValue(): void {
        this.formattedValue = cloneDeep(this.value);
    }

    private assignSubLayout(): void {
        this.subLayout = {
            ...this.config.subtext,
            class: this.config?.subtext?.class || 'mt-1',
            style: this.config?.subtext?.class || 'color: #4d4d4d; font-size: 12px; line-height: 16px;',
        };
        this.subLayoutValue = get(this.value, this.subLayout?.field, '');
    }

    /**
     * @private
     * Formats the value for the link.
     * Provide path for the value via `this.config.linkConfig.valueField`.
     * Provide the format via this.config.linkConfig.format (for now supports only date formating)
     */
    private formatValue(): void {
        const {type, pattern} = this.config?.linkConfig?.format || {};
        if (type && pattern) {
            switch(type) {
                case XmLinkValueFormat.DATE:
                    this.formatDate(pattern);
                    break;
            }
        }
    }

    private formatDate(pattern: string): void {
        if (typeof this.formattedValue !== 'object') {
            return;
        }
        const valueField: string = this.config.linkConfig?.valueField;
        const date: string = get(this.value, valueField, '');
        if (!date) {
            return;
        }
        const formattedDate: string = this.datePipe.transform(date, pattern);
        set(this.formattedValue, valueField, formattedDate);
    }
}
