import { Component, Input, OnInit } from '@angular/core';
import { ConfigValidatorUtil } from '@xm-ngx/administration/specification-management/config-validator/config-validator.util';
import { XmAceEditorControlOptions } from '@xm-ngx/components/ace-editor';
import { finalize } from 'rxjs/operators';
import { XmConfigService } from '../../../../../src/app/shared';
import { Principal } from '@xm-ngx/core/user';

@Component({
    selector: 'xm-private-ui-mng',
    templateUrl: './private-ui-mng.component.html',
})
export class PrivateUiMngComponent implements OnInit {
    @Input() public disabled: boolean;

    public uiPrivateSpecificationIn: string;
    public uiPrivateSpecificationOut: string;
    public uiPrivateValidation: any;
    public isUiPrivateSpecValid: boolean;
    public uiPrivateSpecificationProgress: boolean;
    public aceEditorOptions: XmAceEditorControlOptions = {
        mode: 'yaml',
        options: {
            highlightActiveLine: true,
            maxLines: 50,
        },
    };

    constructor(
        private principal: Principal,
        private service: XmConfigService,
    ) {
    }

    public ngOnInit(): void {
        this.principal.hasPrivileges(['CONFIG.CLIENT.WEBAPP.GET_LIST.ITEM']).then((allow) => {
            if (!allow) {
                return;
            }
            this.service.getConfig('/webapp/settings-private.yml').subscribe((result) => {
                this.uiPrivateSpecificationIn = result;
                this.uiPrivateSpecificationOut = result;
            });
        });
    }

    public updatePrivateUiConfig(): void {
        this.uiPrivateSpecificationProgress = true;
        this.service
            .updateConfig('/webapp/settings-private.yml', this.uiPrivateSpecificationOut)
            .pipe(finalize(() => this.uiPrivateSpecificationProgress = false))
            .subscribe(() => window.location.reload());
    }

    public onPrivateUiSpecificationChange(textChanged: string): void {
        this.uiPrivateSpecificationOut = textChanged;
        this.isUiPrivateSpecValid = false;
        this.uiPrivateValidation = null;
    }

    public validatePrivateUiSpecification(): void {
        const errors = ConfigValidatorUtil.validateYAML(this.uiPrivateSpecificationOut);
        if (errors && errors.length) {
            this.uiPrivateValidation = { errorMessage: '' };
            for (const err of errors) {
                this.uiPrivateValidation.errorMessage += err.message + (err.path ? ' path: ' + err.path : '') + '<br/>';
            }
        } else {
            this.isUiPrivateSpecValid = true;
        }
    }
}
