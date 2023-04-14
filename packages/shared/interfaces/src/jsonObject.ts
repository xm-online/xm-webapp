export type JsonValue =
    // TODO:BACKWARD_COMPATIBILITY: all types must be defined. Remove unknown.
    unknown
    | null
    | string
    | number
    | boolean
    | JsonObject
    | JsonArray;

export interface JsonObject {
    [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {
}

