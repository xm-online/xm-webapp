export interface StateWrapperModel<ConfigType = unknown, EntityType = unknown> {
    config?: ConfigType;
    entity?: EntityType;
    [key: string]: any;
}

export interface WidgetStateInstance {
    selector: string;
    data: StateWrapperModel<any, any>;
}
