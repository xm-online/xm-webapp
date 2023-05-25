import { IIdpConfig, UIPublicConfig } from '@xm-ngx/core';
import { IConfig } from '@xm-ngx/interfaces';

export interface UIPrivateConfig extends IConfig {
}

export interface XmUIConfig extends UIPublicConfig, UIPrivateConfig, IIdpConfig {
}

