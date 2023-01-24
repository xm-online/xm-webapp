import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Principal } from '@xm-ngx/core/user';

import { XmConfigService } from '../../../../src/app/shared/spec/config.service';


@Component({
    selector: 'xm-specification-management',
    templateUrl: './specification-management.component.html',
})
export class SpecificationManagementComponent implements OnInit {

    public specificationTypes: any[] = [
        { slug: 'ui', icon: 'view_quilt' },
        { slug: 'entity', icon: 'build' },
        { slug: 'timeline', icon: 'history' },
        { slug: 'uaa', icon: 'security' },
        { slug: 'uaa-login', icon: 'fingerprint' },
        { slug: 'tenant', icon: 'ballot' },
    ];
    public currentSpecificationSlug: string;

    public disabled: boolean;

    constructor(private activatedRoute: ActivatedRoute,
                private principal: Principal,
                private service: XmConfigService) {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.currentSpecificationSlug = params.slug || this.specificationTypes[0].slug;
        });
    }

    public static renderValidationMessage(validation: any): void {
        const errorMessage = validation.errorMessage;

        const regexp = new RegExp('^(.*)\\(class');
        const errors = regexp.exec(errorMessage);
        if (errors && errors.length > 1) {
            const error = errors[1];
            const line = new RegExp('line: (\\d)').exec(errorMessage);
            const column = new RegExp('column: (\\d)').exec(errorMessage);
            const lineNumber = line && line.length > 0 ? line[1] : '';
            const columnNumber = column && column.length > 0 ? column[1] : '';
            validation.errorMessage = `${error} | line: ${lineNumber} column: ${columnNumber}`;
        }
    }

    public ngOnInit(): void {
        this.principal.hasPrivileges(['CONFIG.CLIENT.WEBAPP.GET_LIST.ITEM']).then((allow) => {
            if (!allow) {
                return;
            }
            this.specificationTypes.push({ slug: 'privateui', icon: 'view_quilt' });
        });

        this.service.getUiConfig().subscribe(result => {
            this.disabled = result.readOnlyConfig;
        });
    }

}
