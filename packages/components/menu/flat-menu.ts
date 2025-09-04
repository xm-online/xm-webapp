import { JavascriptCode } from '@xm-ngx/interfaces';
import { ContextService } from '@xm-ngx/core/context';
import { transpilingForIE } from '@xm-ngx/operators';
import { Dashboard } from '@xm-ngx/core/dashboard';
import { MenuItem } from './menu.interface';
import { XmEntitySpec } from '@xm-ngx/core/entity';
import * as _ from 'lodash';
import { ISideBarConfig } from './menu.component';
import { AccountContextService } from '@xm-ngx/account';
import { Principal } from '@xm-ngx/core/user';

function checkCondition(item: { config?: { condition?: JavascriptCode } }, contextService: ContextService, accountContextService: AccountContextService, principal: Principal): boolean {
    if (!item.config || !item.config.condition) {
        return true;
    }

    try {
        const code = transpilingForIE(item.config.condition, contextService);
        const hasPrivilege = (key: string) => principal.hasPrivilegesInline([key]);
        const hasContextPrivilege = (path: string, key: string) => accountContextService.hasContextPermission(path, key);
        const hasContextKey = (key: string) => accountContextService.hasContextKey(key);
        const contextValue = (key: string) => accountContextService.contextValue(key);

        return Boolean((new Function('hasPrivilege', 'hasContextPrivilege', 'hasContextKey', 'contextValue', 'context', code))( hasPrivilege, hasContextPrivilege, hasContextKey, contextValue, contextService));
    } catch (e) {
        console.warn('RUNTIME JS:', e);
        return false;
    }
}

export function filterByConditionDashboards(dashboards: Dashboard[], contextService: ContextService, accountContextService: AccountContextService, principal: Principal): Dashboard[] {
    return dashboards.filter((i) => checkCondition(i, contextService, accountContextService, principal));
}

export function applicationsToCategory(applications: XmEntitySpec[], sideBarConfig?: ISideBarConfig): MenuItem[] {
    const parent = {
        path: 'application',
        position: sideBarConfig?.sidebar?.applicationPosition || Number.MAX_SAFE_INTEGER,
        permission: 'XMENTITY_SPEC.GET',
        url: ['application'],
        title: sideBarConfig?.sidebar?.applicationTitle || 'global.menu.applications.main',
        icon: sideBarConfig?.sidebar?.applicationIcon || 'apps',
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
