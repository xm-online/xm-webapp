import { Component, OnInit, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';

import { PasswordResetFinish } from './password-reset-finish.service';
import { PasswordSpec } from '../../../xm-entity/shared/password-spec.model';
import { XmConfigService } from '../../../shared/spec/config.service';

interface ResetPasswordFormConfig {
    formTitle: string,
    formMessageInfo: string,
    formMessageError: string,
    formMessageSuccess: string,
    formButtonLabel: string,
}

@Component({
    selector: 'xm-password-reset-finish',
    templateUrl: './password-reset-finish.component.html'
})
export class PasswordResetFinishComponent implements OnInit, AfterViewInit {
    confirmPassword: string;
    doNotMatch: string;
    error: string;
    keyMissing: boolean;
    keyExpired: boolean;
    keyUsed: boolean;
    resetAccount: any;
    success: string;
    modalRef: NgbModalRef;
    key: string;
    config: ResetPasswordFormConfig;
    passwordSettings: PasswordSpec;
    patternMessage: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private passwordResetFinish: PasswordResetFinish,
        private route: ActivatedRoute,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private xmConfigService: XmConfigService,
        private router: Router
    ) {
        this.config = {
            formTitle: 'reset.finish.title',
            formMessageInfo: 'reset.finish.messages.info',
            formMessageError: 'reset.finish.messages.error',
            formMessageSuccess: 'reset.finish.messages.success',
            formButtonLabel: 'reset.finish.form.button',
        }
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.key = params['key'];

            this.passwordResetFinish.check(this.key).subscribe(
                resp => {}, err => {
                    if (err.error && err.error.error) {
                        this.keyExpired = (err.error.error === 'error.reset.code.expired');
                        this.keyUsed = (err.error.error === 'error.reset.code.used');
                    }
            });
        });
        this.route.data.subscribe(data => {
            if (data && data.config) {
                this.config = {
                    formTitle: data.config.formTitle,
                    formMessageInfo: data.config.formMessageInfo,
                    formMessageError: data.config.formMessageError,
                    formMessageSuccess: data.config.formMessageSuccess,
                    formButtonLabel: data.config.formButtonLabel
                };
            }
        });
        this.xmConfigService
            .getPasswordConfig()
            .subscribe((config: any) => {
                this.makePasswordSettings(config);
            }, err => this.makePasswordSettings());
        this.resetAccount = {};
        this.keyMissing = !this.key;
    }

    ngAfterViewInit() {
        let htmlEl = this.elementRef.nativeElement.querySelector('#password');
        htmlEl && this.renderer.invokeElementMethod(htmlEl, 'focus', []);
    }

    finishReset() {
        this.doNotMatch = null;
        this.error = null;
        if (this.resetAccount.password !== this.confirmPassword) {
            this.doNotMatch = 'ERROR';
        } else {
            this.passwordResetFinish.save({key: this.key, newPassword: this.resetAccount.password}).subscribe(() => {
                this.success = 'OK';
            }, () => {
                this.success = null;
                this.error = 'ERROR';
            });
        }
    }

    login() {
        this.router.navigate([''])
    }

    private makePasswordSettings(config?: any): void {
        this.passwordSettings = this.xmConfigService.mapPasswordSettings(config);
        if (this.passwordSettings.patternMessage) {
            this.patternMessage = this.xmConfigService.updatePatternMessage(this.passwordSettings.patternMessage)
        }
    }
}
