import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

export interface ErrorMessagesNotifyConfig {
    dismissible: boolean;
    type: string;
}

declare const $: any;

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

    constructor() {
        this.dismissible = true;
        this.type = 'error';
    }

    public ngOnInit(): void {
        if (this.message) {
            $.notify(
                {
                    icon: 'add',
                    message: this.message,
                },
                {
                    type: this.type,
                    timer: 5000,
                    z_index: 2000,
                    placement: {
                        from: 'top',
                        align: 'right',
                    },
                });
        }
    }
}
