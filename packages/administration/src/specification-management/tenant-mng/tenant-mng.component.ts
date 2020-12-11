import { Component, Input, OnInit } from '@angular/core';
import { ConfigValidatorUtil } from '@xm-ngx/administration/specification-management/config-validator/config-validator.util';
import { finalize } from 'rxjs/operators';
import { XmConfigService } from '../../../../../src/app/shared';

const TENANT_SPEC_PATH = '/tenant-config.yml';

@Component({
    selector: 'xm-tenant-mng',
    templateUrl: './tenant-mng.component.html',
    styleUrls: ['./tenant-mng.component.scss'],
})
export class TenantMngComponent implements OnInit {
    @Input() public readOnlyMode: boolean;

    public tenantSpecificationIn: string;
    public tenantSpecificationOut: string;
    public tenantValidation: any;
    public tenantSpecificationProgress: boolean;
    public isTenantSpecValid: boolean;

    public aceEditorOptions: any = {
        highlightActiveLine: true,
        maxLines: 50,
    };

    constructor(
        private service: XmConfigService,
    ) {
        this.isTenantSpecValid = false;
        this.tenantValidation = null;
    }

    public ngOnInit(): void {
        this.service.getConfig(TENANT_SPEC_PATH).subscribe((result) => {
            this.tenantSpecificationIn = result;
            this.tenantSpecificationOut = result;
        });
    }

    public onTenantSpecificationChange(textChanged: string): void {
        this.tenantSpecificationOut = textChanged;
        this.isTenantSpecValid = false;
        this.tenantValidation = null;
    }

    public validateTenantSpecification(): void {
        const errors = ConfigValidatorUtil.validateYAML(this.tenantSpecificationOut);
        if (errors && errors.length) {
            this.tenantValidation = { errorMessage: '' };
            for (const err of errors) {
                this.tenantValidation.errorMessage += err.message + (err.path ? ' path: ' + err.path : '') + '<br/>';

            }
        } else {
            this.isTenantSpecValid = true;
        }
    }

    public updateTenantConfig(): void {
        this.tenantSpecificationProgress = true;
        this.service
            .updateConfig(TENANT_SPEC_PATH, this.tenantSpecificationOut)
            .pipe(finalize(() => this.tenantSpecificationProgress = false))
            .subscribe(() => window.location.reload());
    }

}
