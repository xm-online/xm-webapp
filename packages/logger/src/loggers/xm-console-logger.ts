import { XmLogger } from '@xm-ngx/logger';
import { upperCase } from 'lodash';
import { LogLevel } from '../services/xm-logger.service';
import { XmLogBroker } from '../interfaces/xm-log-broker';

export class XmConsoleLogger implements XmLogger {

    private logger: typeof console = console;

    constructor(
        private name: string,
        protected broker?: XmLogBroker,
    ) {
    }

    public debug(message: string): void {
        this.format('debug', message);
    }

    public info(message: string): void {
        this.format('info', message);
    }

    public warn(message: string): void {
        this.format('warn', message);
    }

    public error(message: string): void {
        this.format('error', message);
    }

    /**
     * Temporary solution to set timestamp and type
     *
     * @experimental
     * Should be implemented via ngx-logger or alternative
     */
    private format(type: LogLevel, message: string): void {
        const date = new Date().toISOString();
        this.logger[type](`${date} ${upperCase(type)} ${this.name} ${message}`);
        this.broker?.dispatch({ timeStamp: date, name: this.name, message, level: type });
    }
}
