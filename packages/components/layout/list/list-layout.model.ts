import { XmDynamicControllerDeclaration } from '@xm-ngx/dynamic/presentation/xm-dynamic-presentation-base.directive';
import { XmConfig } from '@xm-ngx/interfaces';
import { PermissionCheckStrategy } from '@xm-ngx/core/permission';

export type ListLayoutConfig = {
    layouts: DynamicLayoutConfig[],
};

export type DynamicLayoutConfig<C extends XmConfig = XmConfig> = {
    theme?: DynamicLayoutThemeConfig,
    controllers?: XmDynamicControllerDeclaration[],
    permission?: string | boolean | string[];
    permissionStrategy?: PermissionCheckStrategy;
    selector: string;
    dataQa?: string;
    config?: C;
};

export type DynamicLayoutThemeConfig = {
    class: string,
    style: string,
};
