import { JavascriptCode } from '@xm-ngx/shared/interfaces';
import { ContextService } from '../../../src/app/shared';
import { transpilingForIE } from '@xm-ngx/json-scheme-form';
import { Dashboard } from '@xm-ngx/dashboard';
import { MenuItem } from '@xm-ngx/components/menu/menu.interface';
import { XmEntitySpec } from '@xm-ngx/entity';
import * as _ from 'lodash';

function checkCondition(item: { config?: { condition?: JavascriptCode } }, contextService: ContextService): boolean {
    // If configurator do not provide configs, return true
    if (!item.config || !item.config.condition) {
        return true;
    }

    try {
        const code = transpilingForIE(item.config.condition, contextService);
        return Boolean((new Function('context', code))(contextService));
    } catch (e) {
        console.warn('RUNTIME JS:', e);
        return false;
    }
}

export function filterByConditionDashboards(dashboards: Dashboard[], contextService: ContextService): Dashboard[] {
    return dashboards.filter((i) => checkCondition(i, contextService));
}

export function applicationsToCategory(applications: XmEntitySpec[]): MenuItem[] {
    const parent = {
        path: 'application',
        position: 0,
        permission: 'XMENTITY_SPEC.GET',
        url: ['application'],
        title: 'global.menu.applications.main',
        icon: 'apps',
        parent: null,
        children: [],
    };

    const children: MenuItem[] = applications.map((i) => ({
        path: i.key,
        title: i.pluralName ? i.pluralName : i.name,
        url: [ 'application', i.key ],
        permission: `APPLICATION.${ i.key }`,
        icon: i.icon,
        position: 0,
        parent: parent,
        children: [],
    }));

    return children.length > 0 ? [
        {
            ...parent,
            children,
        },
    ] : [];
}

export function flatTree(categories: MenuItem[]): MenuItem[] {
    return _.flatMap(categories.map((c) => c.children));
}
