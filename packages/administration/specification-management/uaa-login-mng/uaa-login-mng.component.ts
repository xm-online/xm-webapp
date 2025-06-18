import { Component, Input, OnInit } from '@angular/core';
import {
    XmAceEditorControlModeEnum,
    XmAceEditorControlOptions,
    XmAceEditorControlTypeEnum,
} from '@xm-ngx/components/ace-editor';
import { XmConfigService } from '@xm-ngx/core/config';
import { SpecificationManagementComponent } from '../specification-management.component';

@Component({
    selector: 'xm-uaa-login-mng',
    templateUrl: './uaa-login-mng.component.html',
    standalone: false,
})
export class UaaLoginMngComponent implements OnInit {

    @Input() public disabled: boolean;

    public isUaaLoginSpecValid: boolean;
    public loginsSpecificationIn: string;
    public loginsSpecificationOut: string;
    public loginsValidation: any;

    public aceEditorOptions: XmAceEditorControlOptions = {
        mode: XmAceEditorControlModeEnum.YAML,
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
