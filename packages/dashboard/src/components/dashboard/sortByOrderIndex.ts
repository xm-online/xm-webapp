import { DashboardWidget } from '../../models/dashboard-widget.model';

type WidgetWithConfig = DashboardWidget<{ orderIndex?: number }>

export function sortByOrderIndex(arr: DashboardWidget[]): DashboardWidget[] {
    return arr.sort((a, b) => swapByOrderIndex(a, b));
}

/**
 * Sort widgets by optional orderIndex field in widget.config
 */
export function swapByOrderIndex(itemA: WidgetWithConfig, itemB: WidgetWithConfig): number {
    const aIndex = getOrderIndex(itemA.config ? itemA.config : {});
    const bIndex = getOrderIndex(itemB.config ? itemB.config : {});
    return aIndex - bIndex;
}

export function getOrderIndex({ orderIndex = 0 }: { orderIndex?: number }): number {
    return orderIndex;
}
