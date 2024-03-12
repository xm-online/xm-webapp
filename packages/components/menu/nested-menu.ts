import {Dashboard} from '@xm-ngx/core/dashboard';
import {MenuItem} from './menu.interface';
import * as _ from 'lodash';
import {ConditionDirective} from '@xm-ngx/components/condition';

const DEFAULT_DASHBOARD_KEY = 'DASHBOARD';

export function buildMenuTree(dashboards: Dashboard[], checkCondition?: typeof ConditionDirective.checkCondition, conditionArgs: Record<string, unknown> = {}): MenuItem[] {
    const result = _.orderBy(dashboards, [ 'config.orderIndex', 'config.slug' ]).reduce(
        (data, {
            id,
            name: dashboardName,
            config: {
                slug,
                hidden = false,
                menu: configMenu = {},
                icon: configIcon,
                orderIndex: configOrder,
                name: configName,
                permission,
                activeItemPathPatterns,
                category,
                dataQa
            } = {},
        }) => {
            if (hidden) {
                if(!checkCondition || checkCondition(hidden.toString(), conditionArgs)){
                    return data;
                }
            }

            const {
                name: menuName,
                group: { icon: groupIcon, key = DEFAULT_DASHBOARD_KEY, name: groupName, orderIndex: groupOrder } = {},
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
                        url: [ 'dashboard', `${id}` ],
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
                        url: [ 'dashboard', `${id}` ],
                        parent: null,
                        children: [],
                        activeItemPathPatterns,
                    });
                }

                return data;
            }

            const groupKey = key.toLowerCase();
            const parts = slug.replace(/^\/|\/$/g, '').split('/');

            // Add menu item from group object
            // In future it will deprecated
            if (parts.length === 1 && key !== DEFAULT_DASHBOARD_KEY) {
                const group = data.find(r => r.path == groupKey);

                if (!group) {
                    data.push({
                        path: groupKey,
                        position: groupOrder,
                        icon: groupIcon || configIcon,
                        title: groupName,
                        permission: permission || 'DASHBOARD.GET_LIST',
                        url: [ 'dashboard', groupKey ],
                        parent: null,
                        children: [],
                        activeItemPathPatterns,
                        category,
                        dataQa
                    });
                }

                // Prepend config key to nested slug
                parts.unshift(groupKey);
            }

            // Support nested slug
            parts.reduce((tree, path) => {
                // Skip route which has a required param
                // It will display if parent route have not been added
                if (path.startsWith(':')) {
                    return { path, children: [] };
                }

                let node = (tree.children = tree.children || []).find(child => child.path === path);

                if (!node) {
                    node = {
                        path,
                        position: configOrder,
                        icon: configIcon,
                        title: menuName || configName || dashboardName,
                        permission: permission || 'DASHBOARD.GET_LIST',
                        url: [ 'dashboard', ...slug.split('/') ],
                        parent: tree,
                        children: [],
                        activeItemPathPatterns,
                        category,
                        dataQa
                    };

                    tree.children.push(node);
                }

                return node;

            }, { children: data });

            return data;
        }, []);
    return _.orderBy(result, [ 'position' ], 'asc');
}
