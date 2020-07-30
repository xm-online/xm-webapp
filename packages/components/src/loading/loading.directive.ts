import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[xm-loading]',
    host: {
        class: 'xm-loading',
    },
})
export class LoadingDirective {
    @HostBinding('class.xm-loading-active')
    @Input('xm-loading') public active: boolean;
}
