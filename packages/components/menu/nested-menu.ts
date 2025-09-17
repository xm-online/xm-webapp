import { ConditionDirective } from '@xm-ngx/components/condition';
import { Dashboard, DashboardConfig } from '@xm-ngx/core/dashboard';
import * as _ from 'lodash';
import { MenuItem } from './menu.interface';

const DEFAULT_DASHBOARD_KEY = 'DASHBOARD';

export function buildMenuTree(dashboards: Dashboard[], checkCondition?: typeof ConditionDirective.checkCondition, conditionArgs: Record<string, unknown> = {}): MenuItem[] {
    const result = _.orderBy(dashboards, ['config.orderIndex', 'config.slug']).reduce(
        (data, dashboard) => {
            const {id, name: dashboardName, config = {}} = dashboard;
            const {
                slug,
                hidden = false,
                menu: configMenu = {},
                icon: configIcon,
                orderIndex: configOrder,
                name: configName,
                permission,
                activeItemPathPatterns,
            } = config;

            let categoryKey, category, dataQa;
            if ('categoryKey' in config) {
                const typedConfig = config as DashboardConfig;
                categoryKey = typedConfig.categoryKey;
                category = typedConfig.category;
                dataQa = typedConfig.dataQa;
            }

            if (hidden) {
                if (!checkCondition || checkCondition(hidden.toString(), conditionArgs)) {
                    return data;
                }
            }

            const {
                name: menuName,
                group: {icon: groupIcon, key = DEFAULT_DASHBOARD_KEY, name: groupName, orderIndex: groupOrder} = {},
            } = configMenu;

            if (!slug) {
                const group = data.find(r => r.path == 'DASHBOARD');

                if (!group) {
                    data.push({
                        path: 'DASHBOARD',
                        position: groupOrder,
                        icon: 'dashboard',
                        title: 'Dashboards',
                        permission: permission || 'DASHBOARD.GET_LIST',
                        url: ['dashboard', `${id}`],
                        parent: null,
                        children: [],
                        activeItemPathPatterns,
                    });
                } else {
                    group.children.push({
                        path: 'DASHBOARD',
                        position: groupOrder,
                        icon: groupIcon || configIcon,
                        title: dashboardName,
                        permission: permission || 'DASHBOARD.GET_LIST',
                        url: ['dashboard', `${id}`],
                        parent: null,
                        children: [],
                        activeItemPathPatterns,
                    });
                }

                return data;
            }

            const groupKey = key.toLowerCase();
            const parts = slug.replace(/^\/|\/$/g, '').split('/');

            if (parts.length === 1 && key !== DEFAULT_DASHBOARD_KEY) {
                const group = data.find(r => r.path == groupKey);

                if (!group) {
                    data.push({
                        path: groupKey,
                        position: groupOrder,
                        icon: groupIcon || configIcon,
                        title: groupName,
                        permission: permission || 'DASHBOARD.GET_LIST',
                        url: ['dashboard', groupKey],
                        parent: null,
                        children: [],
                        activeItemPathPatterns,
                        categoryKey,
                        category,
                        dataQa,
                    });
                }

                parts.unshift(groupKey);
            }

            parts.reduce((tree, path) => {
                if (path.startsWith(':')) {
                    return {path, children: []};
                }

                let node = (tree.children = tree.children || []).find(child => child.path === path);

                if (!node) {
                    node = {
                        path,
                        position: configOrder,
                        icon: configIcon,
                        title: menuName || configName || dashboardName,
                        permission: permission || 'DASHBOARD.GET_LIST',
                        url: ['dashboard', ...slug.split('/')],
                        slug: `dashboard/${slug}`,
                        parent: tree,
                        children: [],
                        activeItemPathPatterns,
                        categoryKey,
                        category,
                        dataQa,
                    };

                    tree.children.push(node);
                }

                return node;

            }, {children: data});

            return data;
        }, []);
    return _.orderBy(result, ['position'], 'asc');
}
