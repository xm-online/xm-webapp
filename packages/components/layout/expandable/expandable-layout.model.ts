import { XmDynamicControllerConfig } from '@xm-ngx/dynamic/presentation/xm-dynamic-presentation-base.directive';
import { XmConfig } from '@xm-ngx/interfaces';

export type ExpandableLayoutConfig = {
    theme: DynamicLayoutThemeConfig,
    controllers: XmDynamicControllerConfig[],
    header?: {
        togglePosition?: 'before' | 'after',
        layout: DynamicLayoutConfig
    },
    body?: {
        expanded?: boolean;
        layout: DynamicLayoutConfig
    },
};

export type DynamicLayoutConfig<C extends XmConfig = XmConfig> = {
    theme?: DynamicLayoutThemeConfig,
    controllers?: XmDynamicControllerConfig[],
    selector: string;
    config?: C;
};

export type DynamicLayoutThemeConfig = {
    class: string,
    style: string,
};
