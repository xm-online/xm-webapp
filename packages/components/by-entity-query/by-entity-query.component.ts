import { Component, computed, Signal } from '@angular/core';
import { XmDynamicPresentationConstructor } from '@xm-ngx/dynamic';
import { EntityCollectionFactoryService } from '@xm-ngx/repositories';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmTextViewModule } from '@xm-ngx/components/text';
import { clone } from 'lodash/fp';
import {
    BY_ENTITY_QUERY_VALUE_OPTIONS,
    ByEntityQueryValueComponent,
    ByEntityQueryValueOptions,
} from './by-entity-query-value.component';

export interface ByEntityQueryOptions extends ByEntityQueryValueOptions {
    title?: Translate;
    styleInline?: boolean;
}

export const BY_ENTITY_QUERY_OPTIONS: ByEntityQueryOptions = {
    styleInline: false,
    ...BY_ENTITY_QUERY_VALUE_OPTIONS,
};

@Component({
    selector: 'xm-by-entity-query',
    template: `
        <xm-text-view-container [hidden]="!fieldValue()" [styleInline]="queryConfig()?.styleInline"
                                [labelStyleInline]="hasTitle() ? null : 'display:none'">
            <span xmLabel>{{ queryConfig()?.title | translate }}</span>
            <span xmValue>{{ fieldValue() }}</span>
        </xm-text-view-container>
    `,
    standalone: true,
    imports: [
        XmTranslationModule,
        XmTextViewModule,
    ],
    styles: [':host { display: inline-flex; }'],
})
export class ByEntityQueryComponent extends ByEntityQueryValueComponent {

    protected override defaultOptions: ByEntityQueryOptions = clone(BY_ENTITY_QUERY_OPTIONS);

    public readonly queryConfig: Signal<ByEntityQueryOptions> = computed(
        () => this.config() as ByEntityQueryOptions,
    );

    public readonly hasTitle: Signal<boolean> = computed(() => {
        const title = this.queryConfig()?.title;
        if (!title) {
            return false;
        }
        if (typeof title === 'string') {
            return title.trim().length > 0;
        }
        return Object.values(title).some(v => typeof v === 'string' && v.trim().length > 0);
    });

    constructor(protected override factoryService: EntityCollectionFactoryService) {
        super(factoryService);
    }
}

export const XM_BY_ENTITY_QUERY_ENTRY = ByEntityQueryComponent satisfies XmDynamicPresentationConstructor;
