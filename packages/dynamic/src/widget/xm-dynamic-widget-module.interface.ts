import { XmDynamicConstructor } from '../interfaces/xm-dynamic-constructor';
import { XmDynamicEntryModule } from '../interfaces/xm-dynamic-entry-module';
import { XmDynamicWidget } from './xm-dynamic-widget';

/**
 * Use this interface when you create a module with a dynamic widget
 * @public
 */
export interface XmDynamicWidgetModule<T extends XmDynamicWidget = XmDynamicWidget> extends XmDynamicEntryModule {
    entry: XmDynamicConstructor<T>;
}
