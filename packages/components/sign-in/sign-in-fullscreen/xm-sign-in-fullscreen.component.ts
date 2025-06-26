import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Translate } from '@xm-ngx/translation';
import { SignInForm } from '../sign-in-form/sign-in.service';
import { XmSignInFormOptions } from '../sign-in-form/xm-sign-in-form.options';


export interface XmSignInFullscreenOptions extends XmSignInFormOptions {
    bannerImageUrl: string;
    leftLogoUrl: string;
    topLogo: { url: string, title: Translate };
}

@Component({
    selector: 'xm-sign-in-fullscreen',
    host: {class: 'xm-sign-in-fullscreen'},
    templateUrl: './xm-sign-in-fullscreen.component.html',
    styleUrls: ['./xm-sign-in-fullscreen.component.scss'],
    standalone: false,
})
export class XmSignInFullscreenComponent {
    @Input() public options: XmSignInFullscreenOptions;
    @Output() public afterSignIn: EventEmitter<SignInForm> = new EventEmitter<SignInForm>();
}
