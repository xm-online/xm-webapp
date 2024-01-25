import { XmDynamicControllerDeclaration } from '@xm-ngx/dynamic/presentation/xm-dynamic-presentation-base.directive';
import { XmConfig } from '@xm-ngx/interfaces';

export type CardLayoutConfig = {
    theme: DynamicLayoutThemeConfig,
    header?: {
        layout: DynamicLayoutConfig
    },
    body?: {
        layout: DynamicLayoutConfig
    },
    footer?: {
        layout: DynamicLayoutConfig
    },
    dataQaCardLayout?: string,
};

export type DynamicLayoutConfig<C extends XmConfig = XmConfig> = {
    theme?: DynamicLayoutThemeConfig,
    controllers?: XmDynamicControllerDeclaration[],
    selector: string;
    config?: C;
};

export type DynamicLayoutThemeConfig = {
    class: string,
    style: string,
};
