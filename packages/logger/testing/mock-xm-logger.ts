import { XmLogger } from '@xm-ngx/logger';

export class MockXmLogger implements XmLogger {
    public create(): XmLogger {
        return new MockXmLogger();
    }

    public debug(): void {
        // Mock empty
    }

    public info(): void {
        // Mock empty
    }

    public warn(): void {
        // Mock empty
    }

    public error(): void {
        // Mock empty
    }
}
