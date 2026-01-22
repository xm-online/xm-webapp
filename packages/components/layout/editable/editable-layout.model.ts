import { EDIT_STATE } from '@xm-ngx/controllers/features/edit-state-store';
import { XmDynamicControllerDeclaration } from '@xm-ngx/dynamic/presentation/xm-dynamic-presentation-base.directive';
import { XmConfig } from '@xm-ngx/interfaces';

export type EditableLayoutConfig = {
    theme: DynamicLayoutThemeConfig,
    defaultEditState: EDIT_STATE,
    controllers: XmDynamicControllerDeclaration[],
    view?: {
        layout: DynamicLayoutConfig
    },
    edit?: {
        layout: DynamicLayoutConfig
    },
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
