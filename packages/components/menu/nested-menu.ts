import { Dashboard } from '@xm-ngx/dashboard';
import { MenuItem } from '@xm-ngx/components/menu/menu.interface';
import * as _ from 'lodash';

export function buildMenuTree(dashboards: Dashboard[]): MenuItem[] {
    const result = _.orderBy(dashboards, [ 'config.orderIndex', 'config.slug' ]).reduce(
        (result, {
            name: dashboardName,
            config: {
                slug, hidden = false,
                menu: {
                    name: menuName,
                    group: { icon: groupIcon, key = 'DASHBOARD', name: groupName, orderIndex: groupOrder } = {},
                } = {},
                icon: configIcon,
                orderIndex: configOrder,
                name: configName,
                permission,
            },
        }) => {
            if (hidden) {
                return result;
            }

            const groupKey = key.toLowerCase();
            const parts = slug.replace(/^\/|\/$/g, '').split('/');

            // Append parent slug from group object
            // In future it will deprecated
            if (parts.length <= 1) {
                const group = result.find(r => r.path == groupKey);

                if (!group) {
                    result.push({
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

                parts.unshift(groupKey);
            }

            // Support nested slug
            parts.reduce((tree, path) => {
                // Skip route which has a required param
                if (path.startsWith(':')) {
                    return { path, children: [] };
                }

                let node = (tree.children = tree.children || []).find(t => t.path === path);

                if (!node &&
                    path !== groupKey // TODO(yaroslav): hack
                ) {
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

            }, { children: result });

            return result;
        }, []);

    return _.orderBy(result, [ 'position' ], 'asc');
}
