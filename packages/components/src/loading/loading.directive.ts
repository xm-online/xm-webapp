import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[xm-loading]',
    host: {
        class: 'xm-loading',
        '[class.xm-loading-start]': 'position === "start"',
        '[class.xm-loading-center]': 'position === "center"',
        '[class.xm-loading-end]': 'position === "end"',
    },
})
export class LoadingDirective {
    @HostBinding('class.xm-loading-active')
    @Input('xm-loading') public active: boolean;
    @Input('xmLoadingPosition') public position: 'start' | 'center' | 'end' = 'center';

}
