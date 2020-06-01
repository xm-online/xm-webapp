export interface GatewayRoute {
    path: string;
    serviceId: string;
    serviceInstances: any[];
    serviceInstancesStatus: any;
    serviceMetadata: any;
}
