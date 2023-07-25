import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { ITranslate, LanguageService, XmTranslationModule } from '@xm-ngx/translation';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';

import { AuthServerProvider } from '@xm-ngx/core/user';
import { LoaderModule } from '@xm-ngx/components/loader';
import { MarkdownModule } from 'ngx-markdown';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

export interface PrivacyPolicyConfig {
    privacyAndTermsAcceptLabel?: string | ITranslate;
    privacyAndTerms?: string | ITranslate;
}

@Component({
    selector: 'xm-privacy-and-terms-dialog',
    templateUrl: './privacy-and-terms-dialog.component.html',
    styleUrls: ['./privacy-and-terms-dialog.component.scss'],
    standalone: true,
    imports: [
        LoaderModule,
        MarkdownModule,
        MatCheckboxModule,
        XmTranslationModule,
        ModalCloseModule,
        MatDialogModule,
        FormsModule,
        MatButtonModule,
    ],
})
export class PrivacyAndTermsDialogComponent implements OnInit, OnDestroy {

    @Input() public config: PrivacyPolicyConfig;
    public iAgree: boolean = false;
    public agreeLabel: string | ITranslate = 'global.shared.privacy-and-terms-dialog.i-agree';
    public lang: string;
    public termsToken: string;
    public showLoader: boolean;

    constructor(private activeModal: MatDialogRef<PrivacyAndTermsDialogComponent>,
                private authServerProvider: AuthServerProvider,
                private languageService: LanguageService) {
        this.languageService.locale$
            .pipe(takeUntilOnDestroy(this))
            .subscribe((lang) => {
                this.lang = lang;
            });
    }

    public ngOnInit(): void {
        if (this.config && this.config.privacyAndTermsAcceptLabel) {
            this.agreeLabel = this.config.privacyAndTermsAcceptLabel;
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    public onAccept(): void {
        if (!this.termsToken) {
            this.activeModal.close('accept');
        } else {
            this.acceptTerms(this.termsToken);
        }
    }

    private acceptTerms(token: string): void {
        this.showLoader = true;
        this.authServerProvider
            .acceptTermsAndConditions(token)
            .pipe(finalize(() => this.showLoader = false))
            .subscribe(() => this.activeModal.close('accept'), () => this.onCancel());
    }
}
