import { EntityLinkUiConfig } from '@xm-ngx/core/config';
import { BaseSpec } from './base-spec';

export interface LinkSpec extends BaseSpec {
    key?: string;
    name?: any;
    backName?: any;
    builderType?: string;
    typeKey?: string;
    icon?: string;
    max?: number;
}

export interface FullLinkSpec {
    model: LinkSpec;
    interface: EntityLinkUiConfig;
}
