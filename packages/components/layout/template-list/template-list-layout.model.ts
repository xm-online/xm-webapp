import { XmDynamicControllerDeclaration } from '@xm-ngx/dynamic/presentation/xm-dynamic-presentation-base.directive';
import { XmConfig } from '@xm-ngx/interfaces';

export type TemplateListLayoutConfig = {
    dataController: {
        key: string;
        method?: string;
    };
    controllers?: XmDynamicControllerDeclaration[],
    layout: DynamicLayoutConfig,
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
