import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditorUtils } from '@xm-ngx/administration/specification-management/entity-spec-editor/editor-utils';
import { EntitySpecYamlService } from '@xm-ngx/administration/specification-management/entity-spec-editor/entity-spec-yaml.service';
import { MATERIAL_ICONS } from '@xm-ngx/administration/specification-management/entity-spec-editor/material-icons';
import { Spec, XmEntitySpec } from '@xm-ngx/entity';

declare let YAML: any;

type Buffer = {
    entitySpec: XmEntitySpec;
    dataSpec?: string;
    dataForm?: string;
}[];

@Component({
    selector: 'xm-entity-spec-editor',
    templateUrl: './entity-spec-editor.component.html',
    styleUrls: ['./entity-spec-editor.component.scss'],
    providers: [EntitySpecYamlService],
})
export class EntitySpecEditorComponent extends EditorUtils implements OnInit {

    @Input() public entitySpec: string;
    @Input() public disabled: boolean;
    @Output() public entitySpecChange: EventEmitter<string> = new EventEmitter<string>();

    public openedEntitySpec: number;
    public icons: string[] = MATERIAL_ICONS;

    public spec: Spec;

    private buffer: Buffer = [];

    constructor(
        private entitySpecYamlService: EntitySpecYamlService,
    ) {
        super();
    }

    public ngOnInit(): void {
        if (!this.entitySpec) {
            return;
        }

        this.spec = YAML.parse(this.entitySpec);
        this.spec.types.forEach((t) => {
            if (t.dataSpec) {
                t.dataSpec = JSON.stringify(JSON.parse(t.dataSpec), null, 4);
            }
            if (t.dataForm) {
                t.dataForm = JSON.stringify(JSON.parse(t.dataForm), null, 4);
            }
        });
    }

    public onApplyChanges(): void {
        this.buffer.forEach((bi) => {
            const entitySpec = this.spec.types.find((t) => t.key === bi.entitySpec.key);
            if (entitySpec) {
                entitySpec.dataSpec = bi.dataSpec;
                entitySpec.dataForm = bi.dataForm;
            }
        });

        this.spec.types = this.spec.types.sort((a, b) => a.key < b.key ? -1 : 1);
        this.entitySpecChange.emit(this.entitySpecYamlService.toYaml(this.spec));
    }

    public onAddEntitySpec(): void {
        this.spec.types.unshift({
            name: {},
            isApp: false,
            isAbstract: false,
            pluralName: {},
        });
    }

    public onDeleteEntitySpec(entitySpec: XmEntitySpec): void {
        this.spec.types = this.spec.types.filter((t) => t !== entitySpec);
    }

    public onDataSpecChanged(entitySpec: XmEntitySpec, json: string): void {
        let bufferItem = this.buffer.find((bi) => bi.entitySpec === entitySpec);
        if (!bufferItem) {
            bufferItem = { entitySpec };
            this.buffer.push(bufferItem);
        }

        bufferItem.dataSpec = json;
    }

    public onDataFormChanged(entitySpec: XmEntitySpec, json: string): void {
        let bufferItem = this.buffer.find((bi) => bi.entitySpec === entitySpec);
        if (!bufferItem) {
            bufferItem = { entitySpec };
            this.buffer.push(bufferItem);
        }

        bufferItem.dataForm = json;
    }

}

