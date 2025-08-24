import { XmUser } from '@xm-ngx/core/user';

export interface XmIdleTimeConfig {
    /** @deprecated use idleTime property instead*/
    idleLogout?: number; // Timeout in seconds for idle logout
    idleTime?: XmIdleTime;
}

/**
 * Interface representing idle time configuration for session management.
 */
export interface XmIdleTime {
    /**
     * Timeout duration in seconds before considering the session idle.
     */
    staticTimeout: number;

    /**
     * Flag to enable or disable idle time checking.
     */
    checkIdleTime: boolean;

    /**
     * Flag to determine if logout should occur after idle timeout.
     */
    doLogout?: boolean;

    /**
     * Optional HTTP request configuration to execute before logout.
     */
    httpRequestBeforeLogout?: XmIdleTimeBeforeLogoutRequest;

    /**
     * List of DOM events that are considered as user activity.
     */
    activityEvents?: string[];
}

/**
 * Interface for HTTP request details to be sent before logout on idle.
 */
export interface XmIdleTimeBeforeLogoutRequest {
    /**
     * HTTP method to use for the request.
     */
    method: 'DELETE' | 'GET' | 'POST' | 'PUT';

    /**
     * URL endpoint for the request.
     */
    url: string;
}

export interface XmIdleTimeSessionInfo {
    isActiveSession: boolean;
    config: XmIdleTimeConfig;
    user: XmUser;
}
