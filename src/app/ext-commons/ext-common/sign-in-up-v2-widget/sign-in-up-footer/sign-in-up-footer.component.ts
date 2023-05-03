import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmTranslationModule } from '@xm-ngx/translation';
import { SignPageFooter } from '../sign-in-up-v2.model';

@Component({
    selector: 'xm-sign-in-up-footer',
    templateUrl: './sign-in-up-footer.component.html',
    styleUrls: ['./sign-in-up-footer.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        XmTranslationModule,
    ],
})
export class SignInUpFooterComponent {
    @Input() public config: SignPageFooter;
}
