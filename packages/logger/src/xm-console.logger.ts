import { XmLogger } from '@xm-ngx/logger';
import { upperCase } from 'lodash';

export class XmConsoleLogger implements XmLogger {

  private logger: typeof console = console;

  constructor(private name: string) {
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
  private format(type: keyof typeof console, message: string): void {
    this.logger[type](`${new Date().toISOString()} ${upperCase(type)} ${this.name} ${message}`);
  }
}
