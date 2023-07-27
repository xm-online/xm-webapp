import { JsonObject } from './json-object.model';

/**
 * Global empty interface for all configuration entities.
 * This interface acts as a base for defining various configuration objects.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IConfig {}

/**
 * XmConfig is a configuration interface used for storing, restoring, and building UIs.
 * It extends the {@link IConfig} interface and implements {@link JsonObject} for JSON serialization.
 */
export interface XmConfig extends IConfig, JsonObject {
}
