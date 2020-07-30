import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Spec, XmEntitySpec } from '@xm-ngx/entity';
import { MATERIAL_ICONS } from '@xm-ngx/administration/specification-management/entity-spec-editor/material-icons';
import { EntitySpecYamlService } from '@xm-ngx/administration/specification-management/entity-spec-editor/entity-spec-yaml.service';
import { EditorUtils } from '@xm-ngx/administration/specification-management/entity-spec-editor/editor-utils';

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
})
export class EntitySpecEditorComponent extends EditorUtils implements OnInit {

    @Input() public in: string;
    @Output() public out: EventEmitter<string> = new EventEmitter<string>();

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
        this.spec = YAML.parse(this.in);
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
        this.out.emit(this.entitySpecYamlService.toYaml(this.spec));
    }

    public onAddEntitySpec(): void {
        this.spec.types.unshift({
            name: {},
            pluralName: {},
        });
    }

    public onDeleteEntitySpec(entitySpec: XmEntitySpec): void {
        this.spec.types = this.spec.types.filter((t) => t !== entitySpec);
    }

    public onDataSpecChanged(entitySpec: XmEntitySpec, json: string): void {
        let bufferItem = this.buffer.find((bi) => bi.entitySpec === entitySpec);
        if (!bufferItem) {
            bufferItem = {entitySpec};
            this.buffer.push(bufferItem);
        }

        bufferItem.dataSpec = json;
    }

    public onDataFormChanged(entitySpec: XmEntitySpec, json: string): void {
        let bufferItem = this.buffer.find((bi) => bi.entitySpec === entitySpec);
        if (!bufferItem) {
            bufferItem = {entitySpec};
            this.buffer.push(bufferItem);
        }

        bufferItem.dataForm = json;
    }

}

