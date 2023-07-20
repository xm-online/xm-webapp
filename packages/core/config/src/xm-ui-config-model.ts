import { IIdpConfig, UIPublicConfig } from '@xm-ngx/core';
import { XmConfig } from '@xm-ngx/interfaces';

export interface UIPrivateConfig extends XmConfig {
}

export interface XmUIConfig extends UIPublicConfig, UIPrivateConfig, IIdpConfig {
}

