export interface HttpRequestResponse<ResponseType = ArrayBuffer, ConfigType = unknown> {
    response: ResponseType;
    config: ConfigType;
}
