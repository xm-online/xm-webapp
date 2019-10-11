export interface IEntityLifecycleWidgetConfig {
                title?: string;
                entity?: string;
                statuses?: ILifecycleItem[];
                circle?: boolean;
                subscribeEventName?: string;
}

export interface ILifecycleItem {
    name?: string;
    color?: string;
    icon?: string;
    stateKeys?: string[];
    final?: boolean;
    isCurrent?: boolean;
    isColored?: boolean;
}
