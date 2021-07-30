import { upperCase } from 'lodash';
import { XmLogBroker } from '../interfaces/xm-log-broker';
import { XmLogLevel } from '../interfaces/xm-log.interface';
import { XmLogger } from '../interfaces/xm-logger';

/**
 * The default console logger implementation
 */
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

    private format(type: XmLogLevel, message: string): void {
        const date = new Date().toISOString();
        this.logger[type](`${date} ${upperCase(type)} ${this.name} ${message}`);
        this.broker?.dispatch({ timeStamp: date, name: this.name, message, level: type });
    }
}
