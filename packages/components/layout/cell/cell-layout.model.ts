import { XmDynamicControllerDeclaration } from '@xm-ngx/dynamic/presentation/xm-dynamic-presentation-base.directive';
import { JavascriptCode, XmConfig } from '@xm-ngx/interfaces';

export type CellLayoutConfig = {
    layout: DynamicLayoutConfig;
    condition?: JavascriptCode;
};

export type DynamicLayoutConfig<C extends XmConfig = XmConfig> = {
    theme?: DynamicLayoutThemeConfig,
    controllers?: XmDynamicControllerDeclaration[],
    dataQa?: string;
    selector: string;
    config?: C;
};

export type DynamicLayoutThemeConfig = {
    class?: string,
    style?: string,
};
