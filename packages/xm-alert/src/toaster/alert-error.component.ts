import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { I18nNamePipe } from '@xm-ngx/components/language';
import { ErrorHandlerEventPayload, XmEventManager } from '@xm-ngx/core';
import * as _ from 'lodash';
import { JhiAlert, JhiAlertService } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { XmConfigService } from '../../../../src/app/shared/spec/config.service';
import { XmAlertService } from '../xm-alert.service';
import { ResponseConfig, ResponseConfigItem, ResponseContext } from './response-config.model';

interface ErrorHandlerEventPayloadProcessed extends ErrorHandlerEventPayload {
    content: HttpErrorResponse | any;
}

@Component({
    selector: 'xm-alert-error',
    templateUrl: './alert-error.component.html',
    styleUrls: ['./alert-error.component.scss'],
})
export class JhiAlertErrorComponent implements OnDestroy {

    public alerts: JhiAlert[] = [];
    private cleanHttpErrorListener: Subscription;
    private rc: ResponseContext;
    private responseConfig: ResponseConfig;

    constructor(
        private toasterService: JhiAlertService,
        private alertService: XmAlertService,
        private eventManager: XmEventManager,
        protected router: Router,
        private i18nNamePipe: I18nNamePipe,
        private translateService: TranslateService,
        private specService: XmConfigService) {

        this.cleanHttpErrorListener = eventManager.subscribe('xm.httpError', (resp) => {
            const response = this.processResponse(resp as any);
            this.specService.getUiConfig().subscribe((result) => {
                if (result?.responseConfig?.responses?.length) {
                    this.rc = { response: response.content, request: response.request };
                    this.responseConfig = new ResponseConfig(result.responseConfig.responses.map((e) => {
                        return new ResponseConfigItem(
                            e.code,
                            e.codePath,
                            e.status,
                            e.type,
                            e.validationField,
                            e.validationFieldsExtractor,
                            e.outputMessage,
                            e.condition,
                            e.redirectUrl,
                        );
                    }));
                    const respConfigEl = this.responseConfig.getResponseConfigItem(this.rc);
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
        if (this.cleanHttpErrorListener !== undefined && this.cleanHttpErrorListener !== null) {
            this.eventManager.destroy(this.cleanHttpErrorListener);
        }
    }

    private configAndSendError(config: ResponseConfigItem, response: ErrorHandlerEventPayloadProcessed, params?: any): void {
        const title = this.processMessage(config.outputMessage ?
            config.outputMessage :
            null, response);
        const messageSettings = config.type.split('.') || [];
        switch (messageSettings[0]) {
            case 'swal': {
                this.alertService.open({
                    title,
                    width: '42rem',
                    type: messageSettings[1],
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary',
                }).subscribe((result) => {
                    if (result && config.redirectUrl) {
                        const redirect = (config.redirectUrl === '/') ? '' : config.redirectUrl;
                        this.router.navigate([redirect]);
                    }
                });
                break;
            }
            case 'ignore': {
                break;
            }
            case 'validation': {

                const errors = new Function('rc', config.validationFieldsExtractor)(this.rc);
                for (const key in errors) {
                    errors[key] = this.processMessage(errors[key] ? errors[key] : null, response);
                }
                this.eventManager.broadcast({
                    name: 'xm.ValidationError',
                    content: config,
                    rc: this.rc,
                    title,
                    errors,
                });
                break;
            }
            case 'alert': {
                this.addErrorAlert(title);
                break;
            }
            default: {
                console.warn('Wrong responseConfigItem type - sending default error');
                this.sendDefaultError(response);
            }
        }
    }

    private sendDefaultError(res: ErrorHandlerEventPayloadProcessed): void {
        const httpErrorResponse = res.content;
        switch (httpErrorResponse.status) {
            case 0: {
                // connection refused, server not reachable
                this.addErrorAlert('Server not reachable', 'error.server.not.reachable');
                break;
            }
            case 404: {
                this.addErrorAlert('Not found', 'errors.url.not.found');
                break;
            }
            case 400: {
                const arr = httpErrorResponse.headers.keys();
                let errorHeader = null;
                let entityKey = null;
                arr.forEach((entry) => {
                    if (entry.endsWith('app-error')) {
                        errorHeader = httpErrorResponse.headers.get(entry);
                    } else if (entry.endsWith('app-params')) {
                        entityKey = httpErrorResponse.headers.get(entry);
                    }
                });
                if (errorHeader) {
                    const entityName = this.translateService.instant(`global.menu.entities.${entityKey}`);
                    this.addErrorAlert(errorHeader, errorHeader, { entityName });
                } else {
                    this.defaultErrorHandler(httpErrorResponse);
                }
                break;
            }
            default: {
                this.defaultErrorHandler(httpErrorResponse);
            }
        }
    }

    private addErrorAlert(message: string, key?: string | null, data?: unknown): void {
        key = key ? key : message;
        this.alerts.push(
            this.toasterService.addAlert(
                {
                    type: 'danger',
                    msg: key,
                    params: data,
                    timeout: 5000,
                    toast: true,
                    scoped: true,
                },
                this.alerts,
            ),
        );
    }

    private defaultErrorHandler(res: HttpErrorResponse | any): void {
        if (res?.error?.fieldErrors) {
            const fieldErrors: { field: string, objectName: string, message: string }[] = res.error.fieldErrors;
            for (let i = 0; i < fieldErrors.length; i++) {
                const fieldError = fieldErrors[i];
                // convert 'something[14].other[4].id' to 'something[].other[].id'
                // so translations can be written to it
                const convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
                const fieldName = this.translateService.instant(
                    `jhipsterSampleApplicationApp.${fieldError.objectName}.${convertedField}`,
                );
                this.addErrorAlert(null, `errors.${fieldError.message}`, { fieldName });
            }
        } else if (res?.error?.error && res?.error?.error_description) {
            this.addErrorAlert(
                `errors.${res.error.error_description}`,
                `errors.${res.error.error}`,
                res.error.params,
            );
        } else if (res?.error?.error) {
            this.addErrorAlert(`errors.${res.error.error}`);
        } else if (res?.error?.detail) {
            this.addErrorAlert(res.error.detail);
        } else if (res?.title) {
            this.addErrorAlert(res.title);
        }
    }

    private processMessage(config: any, response: ErrorHandlerEventPayloadProcessed): string | null | any {
        if (!config) {
            return null;
        }
        switch (config.type) {
            case 'TRANSLATION_KEY': {
                return this.translateService.instant(
                    config.value, this.interpolationParams(response, this.rc));
            }
            case 'TRANSLATION_KEY_PATH': {
                return this.translateService.instant(
                    `errors.${_.get(this.rc.response, config.value)}`,
                    this.interpolationParams(response, this.rc));
            }
            case 'MESSAGE_PATH': {
                return _.get(this.rc.response.error, config.value);
            }
            case 'MESSAGE_OBJECT': {
                return this.i18nNamePipe.transform(config.value);
            }
            default: {
                console.warn('Wrong responseConfigItem outputMessage type - returning default message');
                if (response.content.error !== '' && response.content.error.error) {
                    return this.translateService.instant(`errors.${response.content.error.error}`);
                } else {
                    return this.translateService.instant(`errors.${response.content.error}`);
                }
            }
        }
    }

    private interpolationParams(response: ErrorHandlerEventPayloadProcessed, other: any): { rc: any } | any {
        if (response && response.content && response.content.error && response.content.error.params) {
            return Object.assign({}, response.content.error.params);
        }
        return { rc: other };
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
