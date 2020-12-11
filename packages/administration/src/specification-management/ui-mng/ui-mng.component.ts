import { Component, Input, OnInit } from '@angular/core';
import { ConfigValidatorUtil } from '@xm-ngx/administration/specification-management/config-validator/config-validator.util';
import { finalize } from 'rxjs/operators';
import { XmConfigService } from '../../../../../src/app/shared';

@Component({
    selector: 'xm-ui-mng',
    templateUrl: './ui-mng.component.html',
    styleUrls: ['./ui-mng.component.scss'],
})
export class UiMngComponent implements OnInit {

    @Input() public readOnlyMode: boolean;

    public uiSpecificationIn: string;
    public uiSpecificationOut: string;
    public uiValidation: any;
    public isUiSpecValid: boolean;
    public uiSpecificationProgress: boolean;

    public aceEditorOptions: any = {
        highlightActiveLine: true,
        maxLines: 50,
    };

    constructor(
        private service: XmConfigService,
    ) {
        this.isUiSpecValid = false;
        this.uiValidation = null;
    }

    public ngOnInit(): void {
        this.service.getConfig('/webapp/settings-public.yml').subscribe((result) => {
            this.uiSpecificationIn = result;
            this.uiSpecificationOut = result;
        });
    }


    public updateUiConfig(): void {
        this.uiSpecificationProgress = true;
        this.service
            .updateConfig('/webapp/settings-public.yml', this.uiSpecificationOut)
            .pipe(finalize(() => this.uiSpecificationProgress = false))
            .subscribe(() => window.location.reload());
    }


    public onUiSpecificationChange(textChanged: any): void {
        this.uiSpecificationOut = textChanged;
        this.isUiSpecValid = false;
        this.uiValidation = null;
    }

    public validateUiSpecification(): void {
        const errors = ConfigValidatorUtil.validateYAML(this.uiSpecificationOut);
        if (errors && errors.length) {
            this.uiValidation = { errorMessage: '' };
            for (const err of errors) {
                this.uiValidation.errorMessage += err.message + (err.path ? ' path: ' + err.path : '') + '<br/>';
            }
        } else {
            this.isUiSpecValid = true;
        }
    }

}
