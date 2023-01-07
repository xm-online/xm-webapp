import { Component, Input, OnInit } from '@angular/core';
import { SpecificationManagementComponent } from '@xm-ngx/administration/specification-management/specification-management.component';
import { XmAceEditorControlOptions } from '@xm-ngx/components/ace-editor';
import { XmConfigService } from '@xm-ngx/core/config';

@Component({
    selector: 'xm-timeline-mng',
    templateUrl: './timeline-mng.component.html',
})
export class TimelineMngComponent implements OnInit {
    @Input() public disabled: boolean;

    public timelineSpecificationIn: string;
    public timelineSpecificationOut: string;
    public timelineValidation: any;
    public isTimelineSpecValid: boolean;

    public aceEditorOptions: XmAceEditorControlOptions = {
        mode: 'yaml',
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
        this.service.getConfig('/timeline/timeline.yml').subscribe((result) => {
            this.timelineSpecificationIn = result;
            this.timelineSpecificationOut = result;
        });
    }

    public onTimelineSpecificationChange(textChanged: string): void {
        this.isTimelineSpecValid = false;
        this.timelineValidation = null;
        this.timelineSpecificationOut = textChanged;
    }

    public validateTimelineConfig(): void {
        this.service.validateTimelineSpec(this.timelineSpecificationOut).subscribe((result) => {
            this.timelineValidation = result;
            this.isTimelineSpecValid = !!this.timelineValidation.valid;
            SpecificationManagementComponent.renderValidationMessage(this.timelineValidation);
        });
    }


    public updateTimelineConfig(): void {
        this.service.updateTimelineSpec(this.timelineSpecificationOut).subscribe(() => {
            this.isTimelineSpecValid = false;
            window.location.reload();
        });
    }
}
