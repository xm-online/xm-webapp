import { Component, Input } from '@angular/core';
import { StateSpec, XmEntitySpec } from '@xm-ngx/entity';
import { MATERIAL_ICONS } from '@xm-ngx/administration/specification-management/entity-spec-editor/material-icons';
import { EditorUtils } from '@xm-ngx/administration/specification-management/entity-spec-editor/editor-utils';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
    selector: 'xm-states-editor',
    templateUrl: './states-editor.component.html',
    styleUrls: ['./states-editor.component.scss'],
})
export class StatesEditorComponent extends EditorUtils {

    @Input() public entitySpec: XmEntitySpec = {};

    public openedStateSpec: number;
    public icons: string[] = MATERIAL_ICONS;

    public onAddStateSpec(entitySpec: XmEntitySpec): void {
        if (!entitySpec?.states) {
            entitySpec.states = [];
        }
        entitySpec.states.unshift({
            name: {},
        });
    }

    public onDeleteStateSpec(entitySpec: XmEntitySpec, stateSpec: StateSpec): void {
        entitySpec.states = entitySpec.states.filter((t) => t !== stateSpec);
    }

    public isNextStateSelected(stateSpec: StateSpec, nextStateSpec: StateSpec): boolean {
        return stateSpec.next && !!stateSpec.next.find((n) => n.stateKey === nextStateSpec.key);
    }

    public onNextStateChange(stateSpec: StateSpec, event: MatSelectionListChange): void {
        if (event.option.selected) {
            if (!stateSpec.next) {
                stateSpec.next = [];
            }
            stateSpec.next.push({
                stateKey: event.option.value.key,
                name: JSON.parse(JSON.stringify(event.option.value.name)),
            });
        } else {
            stateSpec.next = stateSpec.next.filter((n) => n.stateKey !== event.option.value.key);
        }
    }

}
