import { XmDynamicControllerDeclaration } from '@xm-ngx/dynamic/presentation/xm-dynamic-presentation-base.directive';
import { XmConfig } from '@xm-ngx/interfaces';

export type ExpandableLayoutConfig = {
    panel: DynamicLayoutThemeConfig,
    panelHeader: DynamicLayoutThemeConfig,
    header?: {
        togglePosition?: 'before' | 'after',
        layout: DynamicLayoutConfig
    },
    body?: {
        expanded?: boolean;
        layout: DynamicLayoutConfig
    },
    dataQa?: string,
};

export type DynamicLayoutConfig<C extends XmConfig = XmConfig> = {
    theme?: DynamicLayoutThemeConfig,
    controllers?: XmDynamicControllerDeclaration[],
    selector: string;
    dataQa?: string;
    config?: C;
};

export type DynamicLayoutThemeConfig = {
    class: string,
    style: string,
};
