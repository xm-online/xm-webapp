import { XmDynamicControllerDeclaration } from '@xm-ngx/dynamic/presentation/xm-dynamic-presentation-base.directive';
import { JavascriptCode, XmConfig } from '@xm-ngx/interfaces';

export type DataLayoutConfig = {
    field?: string;
    condition?: JavascriptCode;
    transform?: string;
    layout: DynamicLayoutConfig;
    dataController?: {
        key: string;
        method?: string;
    }
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

export type AbstractDataController = {}
