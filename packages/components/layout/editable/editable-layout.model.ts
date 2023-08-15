import { XmDynamicControllerConfig } from '@xm-ngx/dynamic/presentation/xm-dynamic-presentation-base.directive';
import { XmConfig } from '@xm-ngx/interfaces';

export type EditableLayoutConfig = {
    theme: DynamicLayoutThemeConfig,
    controllers: XmDynamicControllerConfig[],
    view?: {
        layout: DynamicLayoutConfig
    },
    edit?: {
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
