import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LIST_DEFAULT_FIELDS } from '@xm-ngx/translation';
import { Spec } from '@xm-ngx/entity';
import { XmDynamicWidget } from '@xm-ngx/dynamic';

@Component({
    selector: 'xm-entity-list-widget',
    templateUrl: './entity-list-widget.component.html',
})
export class EntityListWidgetComponent implements OnInit, XmDynamicWidget {

    @Input() public config: any;
    public spec: Spec;
    public defaultFieldsKeys: string[] = [
        LIST_DEFAULT_FIELDS.name,
        LIST_DEFAULT_FIELDS.typeKey,
        LIST_DEFAULT_FIELDS.startDate,
        LIST_DEFAULT_FIELDS.stateKey,
    ];

    constructor(private translateService: TranslateService) {
    }

    public ngOnInit(): void {
        if (this.config && this.config.entities) {
            for (const entityOptions of this.config.entities) {
                if (!entityOptions.fields) {
                    this.translateService.get(this.defaultFieldsKeys).subscribe(() => {
                        entityOptions.fields = this.buildDefaultFields();
                    });
                }
            }
        }
    }

    private buildDefaultFields(): object[] {
        return ['name', 'typeKey', 'startDate', 'stateKey'].map((item) => this.newField(item));
    }

    private newField(name: string): { field: string; title: string | any } {
        return {
            field: name,
            title: this.translateService.instant(LIST_DEFAULT_FIELDS[name]),
        };
    }
}
