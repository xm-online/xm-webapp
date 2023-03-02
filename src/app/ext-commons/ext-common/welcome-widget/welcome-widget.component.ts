import { Component, Input } from '@angular/core';

@Component({
    selector: 'xm-welcome-widget',
    templateUrl: './welcome-widget.component.html',
})
export class WelcomeWidgetComponent {
    @Input() public config: any;
}
