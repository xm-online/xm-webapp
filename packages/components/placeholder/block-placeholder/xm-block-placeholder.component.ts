import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'xm-block-placeholder',
    template: '<ng-content></ng-content>',
    host: {
        class: 'xm-block-placeholder',
    },
    styleUrls: ['./xm-block-placeholder.scss'],
})
export class XmBlockPlaceholderComponent {
    @Input() @HostBinding('style.width') public width: string = '100%';
    @Input() @HostBinding('style.height') public height: string = '2rem';
}
