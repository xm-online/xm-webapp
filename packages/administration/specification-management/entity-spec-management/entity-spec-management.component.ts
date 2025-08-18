import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    XmAceEditorControlModeEnum,
    XmAceEditorControlOptions,
    XmAceEditorControlTypeEnum,
} from '@xm-ngx/components/ace-editor';
import { XmConfigService, XmUIConfig, XmUiConfigService } from '@xm-ngx/core/config';
import { StatesManagementDialogComponent } from '@xm-ngx/entity';
import { firstValueFrom } from 'rxjs';

import { ConfigValidatorUtil } from '../config-validator/config-validator.util';
import { ConfigVisualizerDialogComponent } from '../config-visualizer-dialog/config-visualizer-dialog.component';

@Component({
    selector: 'xm-entity-spec-mng',
    templateUrl: './entity-spec-management.component.html',
    standalone: false,
})
export class EntitySpecManagementComponent implements OnInit {

    @Input() public disabled: boolean;

    public entityValidation: any;
    public isXmEntitySpecValid: boolean;
    public entitySpecificationIn: string;
    public disableEntitySpecificationEditor: boolean;
    public entitySpecificationOut: string;
    public line: number;
    public aceEditorOptions: XmAceEditorControlOptions = {
        mode: XmAceEditorControlModeEnum.YAML,
        type: XmAceEditorControlTypeEnum.STRING,
        options: {
            highlightActiveLine: true,
            maxLines: 50,
        },
    };

    constructor(
        private modalService: MatDialog,
        private service: XmConfigService,
        private xmUiConfigService: XmUiConfigService<EntitySpecEditorConfig>,
    ) {
    }

    public async ngOnInit(): Promise<void> {
        this.service.getConfig('/entity/xmentityspec.yml').subscribe((result) => {
            this.entitySpecificationIn = result;
            this.entitySpecificationOut = result;
        });
        const uiConfig = await firstValueFrom(this.xmUiConfigService.config$());
        this.disableEntitySpecificationEditor = uiConfig?.disableEntitySpecificationEditor;
    }

    public onApplyChanges(event: string): void {
        this.entitySpecificationIn = event;
        this.onEntitySpecificationChange(event);
    }

    public onEntitySpecificationChange(textChanged: string): void {
        this.isXmEntitySpecValid = false;
        this.entityValidation = null;
        this.entitySpecificationOut = textChanged;
    }

    public validateXmEntitySpec(): void {
        const errors = ConfigValidatorUtil.validate(this.entitySpecificationOut);
        if (errors && errors.length) {
            this.entityValidation = {errorMessage: ''};
            for (const err of errors) {
                this.entityValidation.errorMessage += err.message + (err.path ? ` path: ${err.path}` : '') + '<br/>';
                if (err.line) {
                    this.line = err.line;
                }
            }
        } else {
            this.isXmEntitySpecValid = true;
        }
    }

    public onShowConfigVisualizerDialog(): void {
        const modalRef = this.modalService
            .open(ConfigVisualizerDialogComponent,
                {width: '80vw'});
        modalRef.componentInstance.entitySpecification = this.entitySpecificationOut;
    }

    public onShowConfigStatesManagementDialog(): void {
        this.modalService.open(StatesManagementDialogComponent, {width: '500px'});
    }


    public updateEntityConfig(): void {
        this.service.updateXmEntitySpec(this.entitySpecificationOut).subscribe(() => {
            window.location.reload();
        });
    }

}

interface EntitySpecEditorConfig extends XmUIConfig {
    disableEntitySpecificationEditor: boolean;
}
