import { UIPublicConfig } from '@xm-ngx/core';

export interface UIPrivateConfig {
    favicon?: string;
}

export interface XmUIConfig extends UIPublicConfig, UIPrivateConfig {
}
