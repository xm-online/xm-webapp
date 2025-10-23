import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { I18nNamePipe, TranslatePipe, XmTranslationModule } from '@xm-ngx/translation';
import { ErrorHandlerEventName, ErrorHandlerEventPayload, XmEventManager, XmPublicUiConfigService } from '@xm-ngx/core';
import { XmToasterService } from '@xm-ngx/toaster';
import * as _ from 'lodash';
import { JhiAlertService } from '@xm-ngx/jhipster';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { XmAlertService } from '@xm-ngx/alert';
import { ResponseConfig, ResponseConfigItem, ResponseConfigType, ResponseContext } from '../response-config.model';
import { XmUIConfig } from '@xm-ngx/core/config';
import { CommonModule } from '@angular/common';
import { XmErrorMessagesNotifyComponent } from './error-messages-notify.component';
import { MatDialog } from '@angular/material/dialog';

interface ErrorHandlerEventPayloadProcessed extends ErrorHandlerEventPayload {
    content: HttpErrorResponse | any;
}

interface UIResponseConfig extends XmUIConfig {
    responseConfig: {
        responses: UIResponseConfigResponses[];
        hideErrorMessages?: boolean;
    };
}

interface UIResponseConfigResponses {
    code: string;
    codePath: string;
    status: string;
    type: ResponseConfigType;
    validationField: string;
    validationFieldsExtractor: string;
    outputMessage: {
        type: string;
        value: string;
    };
    toastDuration: number,
    condition: string;
    requestPathPattern: string;
    redirectUrl: string;
}

@Component({
    standalone: true,
    selector: 'xm-error-messages',
    templateUrl: './error-messages.component.html',
    imports: [
        CommonModule,
        XmTranslationModule,
        XmErrorMessagesNotifyComponent,
    ],
})
export class JhiAlertErrorComponent implements OnDestroy {

    private subscription: Subscription;
    private responseContext: ResponseContext;

    constructor(
        public jhiAlertService: JhiAlertService,
        private translatePipe: TranslatePipe,
        private alertService: XmAlertService,
        private toasterService: XmToasterService,
        private eventManager: XmEventManager,
        private dialogRef: MatDialog,
        private router: Router,
        private i18nNamePipe: I18nNamePipe,
        private translateService: TranslateService,
        private specService: XmPublicUiConfigService<UIResponseConfig>) {

        this.subscription = eventManager.listenTo(ErrorHandlerEventName).pipe(
            map((res) => this.processResponse(res as any)),
        ).subscribe((response) => {
            this.specService.config$().pipe(take(1)).subscribe((result) => {
                if (result?.responseConfig?.responses?.length) {
                    this.responseContext = {response: response.content, request: response.request};
                    const responseConfig = new ResponseConfig(result.responseConfig.responses.map((e) => {
                        return new ResponseConfigItem(
                            e.code,
                            e.codePath,
                            e.status,
                            e.type,
                            e.validationField,
                            e.validationFieldsExtractor,
                            e.outputMessage,
                            e.toastDuration,
                            e.condition,
                            e.requestPathPattern,
                            e.redirectUrl,
                        );
                    }));
                    const respConfigEl = responseConfig.getResponseConfigItem(this.responseContext);
                    if (respConfigEl) {
                        this.configAndSendError(respConfigEl, response);
                    } else {
                        this.sendDefaultError(response);
                    }
                } else {
                    this.sendDefaultError(response);
                }
            });
        });
    }

    public ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    private configAndSendError(config: ResponseConfigItem, response: ErrorHandlerEventPayloadProcessed, params?: any): void {
        const title: string = this.processMessage(
            config.outputMessage ? config.outputMessage : null,
            response,
        );
        const messageSettings = config.type.split('.') || [];
        switch (messageSettings[0]) {
            case 'redirect': {
                const redirect = (config.redirectUrl === '/') ? '' : config.redirectUrl;
                response.content.handled = true;
                this.dialogRef.closeAll();
                this.router.navigate([redirect]);
                break;
            }
            case 'swal': {
                this.alertService.open({
                    title,
                    width: '42rem',
                    icon: messageSettings[1],
                    className: messageSettings && messageSettings[1] ? `type-${messageSettings[1]}` : '',
                }).subscribe((result) => {
                    if (result && config.redirectUrl) {
                        const redirect = (config.redirectUrl === '/') ? '' : config.redirectUrl;
                        this.router.navigate([redirect]);
                    }
                });
                response.content.handled = true;
                break;
            }
            case 'ignore': {
                break;
            }
            case 'validation': {

                const errors: {
                    [key: string]: { type: string, value: string }
                } = new Function('rc', config.validationFieldsExtractor)(this.responseContext);
                for (const key in errors) {
                    errors[key] = this.processMessage(errors[key] ? errors[key] : null, response);
                }
                this.eventManager.broadcast({
                    name: 'xm.ValidationError',
                    content: config,
                    rc: this.responseContext,
                    title,
                    errors,
                });
                break;
            }
            case 'alert': {
                const options = { ...(config.toastDuration && { toastDuration: config.toastDuration }) };
                this.showError(title, options);
                response.content.handled = true;
                break;
            }
            default: {
                console.warn('Wrong responseConfigItem type - sending default error');
                this.sendDefaultError(response);
            }
        }
    }

    private sendDefaultError(res: ErrorHandlerEventPayloadProcessed): void {
        const content = res.content;
        switch (content.status) {
            case 0: {
                this.showError(null, {key: 'error.server.not.reachable'});
                break;
            }
            case 404: {
                this.showError(null, {key: 'error.url.not.found'});
                break;
            }
            case 403: {
                this.showError(null, {key: 'error.403'});
                break;
            }
            case 400: {
                const arr = content.headers.keys();
                let errorHeader: string = null;
                let entityKey = null;
                arr.forEach((entry) => {
                    if (entry.endsWith('app-error')) {
                        errorHeader = content.headers.get(entry);
                    } else if (entry.endsWith('app-params')) {
                        entityKey = content.headers.get(entry);
                    }
                });
                if (errorHeader) {
                    const entityName = this.translateService.instant(`global.menu.entities.${entityKey}`);
                    this.showError(errorHeader, {key: errorHeader, data: {entityName}});
                } else {
                    this.defaultErrorHandler(content);
                }
                break;
            }
            case 413: {
                this.showError(null, {key: 'error.413'});
                break;
            }
            default: {
                this.defaultErrorHandler(content);
            }
        }
    }

    private showError(rawMessage: string, options?: {
        key?: string | null;
        data?: unknown;
        toastDuration?: number
    }): void {
        const {key, data, toastDuration} = options || {};
        let message: string;
        if (key) {
            // TODO: At the BE exists 2 types of the errors with the error. and without,
            //  it should be removed after the BE provides the error standard
            message = key.replace(/errors\./, 'error.');
            message = message.startsWith('error.') ? message : 'error.' + message;
        } else {
            message = rawMessage;
        }
        const text: string = this.translatePipe.transform(message, data);
        setTimeout(() => this.toasterService.create({
            type: 'danger',
            params: data,
            timeout: this.convertToastDuration(toastDuration),
            text,
        }).subscribe());
    }

    private convertToastDuration(duration: number) {
        const defaultDuration = 5000;
        return duration ? duration * 1000 : defaultDuration;
    }

    private defaultErrorHandler(res: HttpErrorResponse | {
        title?: string,
        error: { error_description: string, error: string, detail: any, params }
    }): void {
        if (!res) {
            return;
        }
        if (res.error?.fieldErrors) {
            const fieldErrors: { field: string, objectName: string, message: string }[] = res.error.fieldErrors;
            for (let i = 0; i < fieldErrors.length; i++) {
                const fieldError = fieldErrors[i];
                // convert 'something[14].other[4].id' to 'something[].other[].id'
                // so translations can be written to it
                const convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
                const fieldName = this.translateService.instant(
                    `jhipsterSampleApplicationApp.${fieldError.objectName}.${convertedField}`,
                );
                this.showError(null, {
                    key: `${fieldError.message}`,
                    data: {fieldName}
                });
            }
        } else if (res.error?.error && res.error?.error_description) {
            this.showError(
                res.error.error_description,
                {
                    key: res.error.error,
                    data: res.error.params
                }
            );
        } else if (res.error?.error && typeof res.error?.error === 'string') {
            this.showError(res.error.error);
        } else if (res.error?.detail) {
            this.showError(res.error.detail);
            // TODO: handle type incompatibility
        } else if ((res as { title: string }).title) {
            this.showError((res as { title: string }).title);
        }
    }

    private processMessage(config: {
        type: string,
        value: string
    } | null, response: ErrorHandlerEventPayloadProcessed): string | null | any {
        if (!config) {
            return null;
        }

        switch (config.type) {
            case 'TRANSLATION_KEY': {
                return this.translateService.instant(
                    config.value, this.interpolationParams(response, this.responseContext));
            }
            case 'TRANSLATION_KEY_PATH': {
                return this.translateService.instant(
                    `errors.${_.get(this.responseContext.response, config.value)}`,
                    this.interpolationParams(response, this.responseContext));
            }
            case 'MESSAGE_PATH': {
                return _.get(this.responseContext.response.error, config.value);
            }
            case 'MESSAGE_OBJECT': {
                return this.i18nNamePipe.transform(config.value);
            }
            default: {
                console.warn('Wrong responseConfigItem outputMessage type - returning default message');
                if (response.content.error !== '' && response.content.error.error) {
                    return this.translateService.instant(`errors.${response.content.error.error}`);
                }
                return this.translateService.instant(`errors.${response.content.error}`);

            }
        }
    }

    private interpolationParams(response: ErrorHandlerEventPayloadProcessed, other: any): { rc: any } | any {
        if (response && response.content && response.content.error && response.content.error.params) {
            return Object.assign({}, response.content.error.params);
        }
        return {rc: other};
    }

    private processResponse(resp: ErrorHandlerEventPayloadProcessed): ErrorHandlerEventPayloadProcessed {
        const requestType = resp.request.responseType;
        const respType = resp.content.headers.get('content-type');
        if (requestType === 'arraybuffer' && respType === 'application/json;charset=UTF-8') {
            try {
                const decodedString = String.fromCharCode.apply(null, new Uint8Array(resp.content.error));
                const error = JSON.parse(decodedString);
                resp.content.error = error;
                return resp;
            } catch (e) {
                console.warn(e);
            }
        }
        try {
            const errorType = typeof resp.content.error;
            if (errorType && errorType === 'string') {
                resp.content.error = JSON.parse(resp.content.error);
            }
        } catch (e) {
            console.warn(e);
        }
        return resp;
    }
}
