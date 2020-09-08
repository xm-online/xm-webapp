import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';

/**
 * Alerts can be used to provide feedback messages.
 */
@Component({
    selector: 'xm-alert',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ``,
})
export class XmAlertComponent implements OnInit {

    @Input() public dismissible: boolean;
    @Input() public type: string;
    @Input() public message: string;
    @Output() public close: EventEmitter<void> = new EventEmitter();

    constructor(
        config: NgbAlertConfig,
        private snackBar: MatSnackBar,
    ) {
        this.dismissible = config.dismissible;
        this.type = config.type;
    }

    public ngOnInit(): void {
        if (this.message) {
            this.showAlert(this.type, this.message);
        }
    }

    public showAlert(type: any, message: any): void {
        this.snackBar.open(message, 'x', { duration: 5000, verticalPosition: 'top', horizontalPosition: 'right' });
    }
}
