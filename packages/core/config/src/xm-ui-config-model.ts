import { UIPublicConfig } from '@xm-ngx/core';

export interface UIPrivateConfig {
    favicon?: string;
}

interface IUIConfig extends UIPublicConfig, UIPrivateConfig {
}

export type XmUIConfig = IUIConfig | any;
