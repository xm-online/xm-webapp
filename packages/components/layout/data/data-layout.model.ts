import { XmDynamicControllerConfig } from '@xm-ngx/dynamic/presentation/xm-dynamic-presentation-base.directive';
import { JavascriptCode, XmConfig } from '@xm-ngx/interfaces';

export type DataLayoutConfig = {
    field?: string;
    condition?: JavascriptCode;
    transform?: string;
    layout: DynamicLayoutConfig;
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

export type AbstractDataController = {}