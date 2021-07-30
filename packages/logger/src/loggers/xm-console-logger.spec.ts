/* eslint-disable no-console */
import { XmConsoleLogger } from './xm-console-logger';
import { XmLogBroker } from '../interfaces/xm-log-broker';
import { XmLog } from '@xm-ngx/logger';
import { Observable, of } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('XmConsoleLogger', () => {
    let service: XmConsoleLogger;
    let consoleSpy: SpyObj<Console>;

    it('should be created', () => {
        service = new XmConsoleLogger('', null);
        void expect(service).toBeTruthy();
    });

    it('should write to console', () => {
        service = new XmConsoleLogger('', null);
        consoleSpy = spyOnAllFunctions(console);

        const ERROR = 'ERROR';
        service.error(ERROR);
        void expect(consoleSpy.error).toHaveBeenCalled();

        const DEBUG = 'DEBUG';
        service.debug(DEBUG);
        void expect(consoleSpy.debug).toHaveBeenCalled();

        const INFO = 'INFO';
        service.info(INFO);
        void expect(consoleSpy.info).toHaveBeenCalled();

        const WARN = 'WARN';
        service.warn(WARN);
        void expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('should dispatch to broker', () => {
        const broker: XmLogBroker = new class extends XmLogBroker {
            public dispatch(log: XmLog): void {
                return;
            }

            public log$(): Observable<XmLog> {
                return of<null>(null);
            }
        };
        service = new XmConsoleLogger('', broker);
        const brokerDispatchSpy = spyOn(broker, 'dispatch').and.callThrough();

        const ERROR = 'ERROR';
        service.error(ERROR);
        void expect(brokerDispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining({ level: 'error' }));

        const DEBUG = 'DEBUG';
        service.debug(DEBUG);
        void expect(brokerDispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining({ level: 'debug' }));

        const INFO = 'INFO';
        service.info(INFO);
        void expect(brokerDispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining({ level: 'info' }));

        const WARN = 'WARN';
        service.warn(WARN);
        void expect(brokerDispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining({ level: 'warn' }));
    });


});
