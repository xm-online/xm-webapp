import { LogLevel } from '../services/xm-logger.service';

export interface XmLog {
    timeStamp: string;
    level: LogLevel;
    name: string;
    message: string;
}
