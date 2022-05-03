import { Dashboard } from '@xm-ngx/dashboard';
import { MenuItem } from '@xm-ngx/components/menu/menu.interface';
import * as _ from 'lodash';

const DEFAULT_DASHBOARD_KEY = 'DASHBOARD';

export function buildMenuTree(dashboards: Dashboard[]): MenuItem[] {
    const result = _.orderBy(dashboards, [ 'config.orderIndex', 'config.slug' ]).reduce(
        (data, {
            id,
            name: dashboardName,
            config: {
                slug, hidden = false,
                menu: configMenu = {},
                icon: configIcon,
                orderIndex: configOrder,
                name: configName,
                permission,
            } = {},
        }) => {
            if (hidden) {
                return data;
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
                    };

                    tree.children.push(node);
                }

                return node;

            }, { children: data });

            return data;
        }, []);

    return _.orderBy(result, [ 'position' ], 'asc');
}
