import { InjectionToken } from '@angular/core';
import { XmDynamicEntries } from './interfaces';
import { XmDynamicExtensionEntry } from './interfaces/xm-dynamic-extension.model';

export const XM_DYNAMIC_ENTRIES = new InjectionToken<XmDynamicEntries>('XM_DYNAMIC_ENTRIES');

export const XM_DYNAMIC_EXTENSIONS = new InjectionToken<XmDynamicExtensionEntry[]>('XM_DYNAMIC_EXTENSION-ENTRIES');
