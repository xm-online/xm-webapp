import { IWidget } from '@xm-ngx/dynamic';
import { InjectionToken } from '@angular/core';
import { IDynamicComponent } from './dynamic-components-base';

export const WIDGET_ACCESSOR = new InjectionToken<IWidget>('WIDGET_ACCESSOR');
export const DYNAMIC_COMPONENTS = new InjectionToken<IDynamicComponent[]>('DYNAMIC_COMPONENTS');
