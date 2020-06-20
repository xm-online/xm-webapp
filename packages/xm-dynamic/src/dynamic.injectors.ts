import { InjectionToken } from '@angular/core';
import { DynamicComponents } from './dynamic.interfaces';

export const DYNAMIC_COMPONENTS = new InjectionToken<DynamicComponents>('DYNAMIC_COMPONENTS');
