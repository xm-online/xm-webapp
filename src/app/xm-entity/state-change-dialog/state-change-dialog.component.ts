import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { XmAlertService } from '@xm-ngx/alert';
import { JsfAttributes } from '@xm-ngx/json-schema-form/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { finalize } from 'rxjs/operators';
import { JsfComponentRegistryService } from 'src/app/shared/jsf-extention/jsf-component-registry.service';
import { NextSpec } from '../shared/state-spec.model';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';

declare let $: any;

@Component({
    selector: 'xm-state-change-dialog',
    templateUrl: './state-change-dialog.component.html',
})
export class StateChangeDialogComponent implements OnInit {

    @Input() public xmEntity: XmEntity;
    @Input() public nextSpec: NextSpec;
    @Input() public dialogTitle: any;
    @Input() public buttonTitle: any;

    public jsfAttributes: JsfAttributes;
    public formData: any = {};
    public showLoader: boolean;
    public isJsonFormValid: boolean = true;

    constructor(private activeModal: MatDialogRef<StateChangeDialogComponent>,
                private xmEntityService: XmEntityService,
                private alertService: XmAlertService,
                private toasterService: XmToasterService,
                private widgetService: JsfComponentRegistryService
                ) {
    }

    public ngOnInit(): void {
        // TODO: think about correct way to work with context
        $.xmEntity = this.xmEntity;
        if (this.nextSpec && this.nextSpec.inputSpec) {
            this.jsfAttributes = this.widgetService.buildJsfAttributes(this.nextSpec.inputSpec, this.nextSpec.inputForm);
        }
        $.xmEntity = null;
    }

    public onChangeState(): void {
        this.showLoader = true;
        this.formData.xmEntity = this.xmEntity;
        this.xmEntityService.changeState(this.xmEntity.id, this.nextSpec.stateKey, this.formData).pipe(finalize(() => {
            this.showLoader = false;
        })).subscribe(
            (r) => {
                this.onSuccessFunctionCall(r);
            },
            () => this.toasterService.error('xm-entity.function-list-card.change-state.error'),
        );
    }

    public onSuccessFunctionCall(r: any): void {
        const data = r.body;
        if (data && this.nextSpec.showResponse) {
            this.alertService.open({
                type: 'success',
                html: `<pre style="text-align: left"><code>${JSON.stringify(data, null, '  ')}</code></pre>`,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-primary',
            }).subscribe();
        } else {
            this.toasterService.success('xm-entity.function-list-card.change-state.success');
        }
        this.activeModal.close('OK');
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    public onChangeForm(data: any): void {
        this.formData = data;
    }

}
