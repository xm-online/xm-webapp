export type QueryParamValue = string | number | boolean;
export type QueryParams = { [key: string]: QueryParamValue };
export type Headers = { [key: string]: string };
export type RequestData = { host: string; headers: Headers };
