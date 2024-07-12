import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { ToasterConfig, XmToasterService } from '@xm-ngx/toaster';
import { take } from 'rxjs';

export interface ErrorMessagesNotifyConfig {
    dismissible: boolean;
    type: string;
}

/**
 * Alerts can be used to provide feedback messages.
 */
@Component({
    standalone: true,
    selector: 'xm-error-messages-notify',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: '',
})
export class XmErrorMessagesNotifyComponent implements OnInit {

    @Input() public dismissible: boolean;
    @Input() public type: string;
    @Input() public message: string;

    private toasterService = inject(XmToasterService);

    constructor() {
        this.dismissible = true;
        this.type = 'error';
    }

    public ngOnInit(): void {
        if (this.message) {
            /**
             * Convert to type for suppress JhiAlertType
             * In the next big release we plan to drop Jhi helper functions
             */
            this.toasterService.create({
                type: this.type,
                text: this.message,
            } as ToasterConfig).pipe(
                take(1),
            ).subscribe();
        }
    }
}
