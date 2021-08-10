/**
 * @public
 * Log types
 */
export type XmLogLevel = 'debug' | 'error' | 'info' | 'warn';

/**
 * @public
 * Log protocol
 */
export interface XmLog {
    /** Log time */
    timeStamp: string;
    /** Log level */
    level: XmLogLevel;
    /** The class name that triggered the event */
    name: string;
    /** Log message */
    message: string;
}
