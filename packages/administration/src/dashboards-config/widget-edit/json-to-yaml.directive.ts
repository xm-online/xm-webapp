import { Directive, EventEmitter, Inject, Input, OnChanges, Output, Self, SimpleChanges } from '@angular/core';
import { XmAceEditorControlComponent } from '@xm-ngx/components/ace-editor';
import { ControlValueAccessor } from '@angular/forms';
import yaml from 'js-yaml';

@Directive({ selector: '[json-to-yaml]', standalone: true })
export class JsonToYamlDirective implements OnChanges {
    @Input('json-to-yaml') public json: object;
    @Output('json-to-yaml') public jsonOrObjectOutput: EventEmitter<object> = new EventEmitter<object>();

    constructor(@Self() @Inject(XmAceEditorControlComponent) private valueAccessor: ControlValueAccessor) {
        this.valueAccessor.registerOnChange((v) => {
            const json = yaml.load(v);
            this.jsonOrObjectOutput.emit(json);
        });
    }
    public ngOnChanges(changes: SimpleChanges): void {
        const yml = yaml.dump(this.json);
        this.valueAccessor.writeValue(yml);
    }
}
