import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { XmAlertService } from '@xm-ngx/alert';
import { XmEventManager } from '@xm-ngx/core';
import { JsfAttributes } from '@xm-ngx/json-schema-form';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { catchError, filter, finalize, share, tap } from 'rxjs/operators';
import { getFileNameFromResponseContentDisposition, saveFile } from '@xm-ngx/operators';
import { FunctionSpec } from '@xm-ngx/core/entity';
import { FunctionService } from '@xm-ngx/core/entity';
import { XmEntity } from '@xm-ngx/core/entity';
import { JsonSchemaFormService } from '@ajsf/core';
import { JsfComponentRegistryService } from '@xm-ngx/json-schema-form/components';
import { XM_ENTITY_EVENT_LIST } from '../constants';

declare let $: any;

const FUNC_CONTEXT_URL = '/api/function-contexts/';

@Component({
    selector: 'xm-function-call-dialog',
    templateUrl: './function-call-dialog.component.html',
    providers: [JsonSchemaFormService],
})
export class FunctionCallDialogComponent implements OnInit, AfterViewInit {

    @Input() public xmEntity: XmEntity;
    @Input() public functionSpec: FunctionSpec;
    @Input() public dialogTitle: any;
    @Input() public buttonTitle: any;
    @Input() public onSuccess: any;
    @Input() public onError: any;
    @Input() public preSendHandler: any;

    @Input() set listSelection(selection: XmEntity[]) {
        this.xmEntityListSelection = selection;
    }

    public jsfAttributes: JsfAttributes;
    public formData: any = {};
    public isJsonFormValid: boolean = true;
    public xmEntityListSelection!: XmEntity[];

    public showLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public showSecondStep$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private activeModal: MatDialogRef<FunctionCallDialogComponent>,
                private functionService: FunctionService,
                private eventManager: XmEventManager,
                private alertService: XmAlertService,
                private ref: ChangeDetectorRef,
                private router: Router,
                private widgetService: JsfComponentRegistryService,
    ) {
    }

    public ngOnInit(): void {
        // TODO: think about correct way to work with context
        const backup = $.xmEntity; // in case being set from another components
        $.xmEntity = this.xmEntity;
        if (this.functionSpec) {
            this.jsfAttributes = this.widgetService.buildJsfAttributes(this.functionSpec.inputSpec || {},
                this.functionSpec.inputForm || {});
        }
        $.xmEntity = backup || null;
        console.info('ngOnInit');
    }

    public ngAfterViewInit(): void {
        this.ref.detectChanges();
    }

    public onConfirmFunctionCall(): void {
        if (this.preSendHandler) {
            if (!this.preSendHandler()) {
                return;
            }
        }

        this.showLoader$.next(true);
        // XXX think about this assignment
        this.formData.xmEntity = this.xmEntity;
        if (this.xmEntityListSelection) {
            this.formData.xmEntityListSelection = this.xmEntityListSelection;
        }
        const eId = this.functionSpec.withEntityId ? this.xmEntity.id : null;

        const apiCall$ = this.functionService.callEntityFunction(this.functionSpec.key, eId, this.formData)
            .pipe(share());

        const isSaveContent = (r) => r.actionType && r.actionType === 'download';

        // save attachment
        const saveContent$ = apiCall$.pipe(
            filter((response) => isSaveContent(response)),
            tap((response) => this.saveAsFile(response)),
        );

        // if !download xmEntity function, emit XM_ENTITY_DETAIL_MODIFICATION notification
        const sendModifyEvent$ = apiCall$.pipe(
            filter((response) => !isSaveContent(response) && !!eId),
            tap(() => this.eventManager.broadcast({name: XM_ENTITY_EVENT_LIST.XM_ENTITY_DETAIL_MODIFICATION})),
        );

        // if !download proceed with on success scenario and emit XM_FUNCTION_CALL_SUCCESS
        const sentCallSuccessEvent$ = apiCall$.pipe(
            filter((response) => !isSaveContent(response)),
            tap((response) => this.onSuccessFunctionCall(response)),
            tap(() => this.eventManager.broadcast({name: XM_ENTITY_EVENT_LIST.XM_FUNCTION_CALL_SUCCESS})),
        );

        merge(saveContent$, sendModifyEvent$, sentCallSuccessEvent$).pipe(
            finalize(() => this.cancelLoader()),
            catchError((response) => this.handleError(response)),
        ).subscribe();
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    public onChangeForm(data: any): void {
        this.formData = data;
    }

    private handleError(response: any): Observable<any> {
        this.cancelLoader();
        if (this.onError) {
            this.onError(response);
        }
        return of();
    }

    private cancelLoader(): void {
        this.showLoader$.next(false);
    }

    private onSuccessFunctionCall(r: any): void {

        let data;
        if (this?.functionSpec?.onlyData) {
            data = r.body;
        } else {
            data = r.body && r.body.data;
        }

        let location: string = r.headers.get('location');

        if (location) {
            location = location
                .split(',')
                .map((it: string) => it.trim())
                .find(it => it !== FUNC_CONTEXT_URL);
        }

        // if onSuccess handler passes, close popup and pass processing to function
        if (this.onSuccess) {
            this.activeModal.close(true);
            this.onSuccess(data, this.formData, location);
            // if response should be shown but there are no form provided
        } else if (data && this.functionSpec.showResponse && !this.functionSpec.contextDataForm) {
            this.activeModal.close(true);
            this.alertService.open({
                icon: 'success',
                html: `<pre style="text-align: left"><code>${JSON.stringify(data, null, '  ')}</code></pre>`,
            }).subscribe();
        } else if (data && this.functionSpec.showResponse && this.functionSpec.contextDataForm) {
            this.showSecondStep$.next(true);
            this.jsfAttributes = this.widgetService.buildJsfAttributes(
                this.functionSpec.contextDataSpec ? this.functionSpec.contextDataSpec : {},
                this.functionSpec.contextDataForm ? this.functionSpec.contextDataForm : {});
            this.jsfAttributes.data = data;
            // if contains a location header, go to location specified
        } else if (location) {
            this.processLocation(location, data);
        } else {
            this.activeModal.close(true);
        }
    }

    private processLocation(location: string, data: unknown): void {
        this.activeModal.close(true);
        if (location) {
            this.router.navigate(
                [location],
                {queryParams: data},
            );
        }
    }

    private saveAsFile(r: any): void {
        const filename = JSON.parse(getFileNameFromResponseContentDisposition(r));
        saveFile(r.body, filename, r.headers.get('content-type'));
        this.activeModal.close(true);
    }
}
