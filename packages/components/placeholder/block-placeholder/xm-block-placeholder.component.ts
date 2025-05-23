import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'xm-block-placeholder',
    template: '<ng-content></ng-content>',
    host: {
        class: 'xm-block-placeholder',
    },
    styleUrls: ['./xm-block-placeholder.scss'],
    standalone: false,
})
export class XmBlockPlaceholderComponent {
    @Input() @HostBinding('style.width') public width: string = 'initial';
    @Input() @HostBinding('style.height') public height: string = '2rem';
}
