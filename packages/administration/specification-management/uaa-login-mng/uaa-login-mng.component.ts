import { Component, Input, OnInit } from '@angular/core';
import { SpecificationManagementComponent } from '../specification-management.component';
import {XmAceEditorControlModeEnum, XmAceEditorControlOptions} from '@xm-ngx/components/ace-editor';
import { XmConfigService } from '@xm-ngx/core/config';
import {XmAceEditorControlTypeEnum} from '@xm-ngx/components/ace-editor/ace-editor-control/xm-ace-editor-control.model';

@Component({
    selector: 'xm-uaa-login-mng',
    templateUrl: './uaa-login-mng.component.html',
})
export class UaaLoginMngComponent implements OnInit {

    @Input() public disabled: boolean;

    public isUaaLoginSpecValid: boolean;
    public loginsSpecificationIn: string;
    public loginsSpecificationOut: string;
    public loginsValidation: any;

    public aceEditorOptions: XmAceEditorControlOptions = {
        mode: XmAceEditorControlModeEnum.JSON,
        type: XmAceEditorControlTypeEnum.STRING,
        options: {
            highlightActiveLine: true,
            maxLines: 50,
        },
    };

    constructor(
        private service: XmConfigService,
    ) {
    }

    public ngOnInit(): void {
        this.service.getConfig('/uaa/logins.yml').subscribe((result) => {
            this.loginsSpecificationIn = result;
            this.loginsSpecificationOut = result;
        });
    }

    public onLoginsSpecificationChange(textChanged: string): void {
        this.isUaaLoginSpecValid = false;
        this.loginsValidation = null;
        this.loginsSpecificationOut = textChanged;
    }

    public validateLoginsSpecification(): void {
        this.service.validateLoginsSpec(this.loginsSpecificationOut).subscribe((result) => {
            this.loginsValidation = result;
            this.isUaaLoginSpecValid = !!this.loginsValidation.valid;
            SpecificationManagementComponent.renderValidationMessage(this.loginsValidation);
        });
    }

    public updateLoginsSpecification(): void {
        this.service.updateLoginsSpec(this.loginsSpecificationOut).subscribe(() => {
            this.isUaaLoginSpecValid = false;
            window.location.reload();
        });
    }
}
