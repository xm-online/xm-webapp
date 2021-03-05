import { XmDynamicEntries, XmDynamicEntryModule } from '@xm-ngx/dynamic';

/** @deprecated use {@link XmDynamicEntryModule} instead. */
export type DynamicModule<T = unknown> = XmDynamicEntryModule<T>;

/** @deprecated use {@link XmDynamicEntries} instead. */
export type DynamicComponents = XmDynamicEntries;
