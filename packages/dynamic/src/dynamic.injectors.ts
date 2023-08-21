import { InjectionToken } from '@angular/core';
import { XmConfig } from '@xm-ngx/interfaces';
import { XmDynamicEntries } from './interfaces/xm-dynamic-entry';
import { XmDynamicExtensionEntry } from './interfaces/xm-dynamic-extension.model';

export const XM_DYNAMIC_ENTRIES = new InjectionToken<XmDynamicEntries>('XM_DYNAMIC_ENTRIES');

export const XM_DYNAMIC_EXTENSIONS = new InjectionToken<XmDynamicExtensionEntry[]>('XM_DYNAMIC_EXTENSION-ENTRIES');

export const XM_DYNAMIC_COMPONENT_CONFIG = new InjectionToken<XmConfig>('XM_DYNAMIC_COMPONENT_CONFIG');
