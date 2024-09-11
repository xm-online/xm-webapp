import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatMenuModule, MatMenuPanel } from '@angular/material/menu';
import { text } from '@fortawesome/fontawesome-svg-core';

export enum InputType {
    Toggle = 'toggle',
    Input = 'input',
    Calendar = 'calendar'
}

@Component({
    selector: 'xm-chips-filter-btn',
    standalone: true,
    imports: [CommonModule, MatChipsModule, MatIconModule, XmTranslationModule, MatMenuModule],
    templateUrl: './chips-filter-btn.component.html',
    styleUrl: './chips-filter-btn.component.scss',
})
export class ChipsFilterBtnComponent implements OnInit, OnChanges {
    @Input() public title: string;
    @Input() public value: any;
    @Input() public customIcon: string;
    @Input() public valueText: any;
    @Input() public fieldInput: any = null;
    @Input() public menu: MatMenuPanel = null;
    @Input() public arrow: boolean = false;
    @Input() public disabled: boolean = false;
    @Input() public inputField: any = null;
    @Input() type: InputType = InputType.Input;
    @Input() public textWidth: string = '120px';
    @Output() public valueCleared = new EventEmitter<void>();
    @Output() public valueToggle = new EventEmitter<void>();
    public isChecked: boolean = false;

    public ngOnInit(): void {
        //this.isChecked = (this.value || this.valueText);
    }

    public ngOnChanges(changes: SimpleChanges) {
       /* if (!changes.valueText?.currentValue) {
            //this.isChecked = null;
        }*/
    }

    public clickAction(): void {
        if (InputType.Toggle) {
            this.isChecked = !this.isChecked;
            this.valueToggle.emit();
            this.value = this.valueText;
        }
        if (this.inputField?.nativeElement) {
            this.inputField.nativeElement.focus();
        }
    }

    public clear(event: Event): void {
        event.stopPropagation();
        this.isChecked = false;
        this.value = null;
        this.valueCleared.emit();
    }

    public isArray(value: any): boolean {
        return Array.isArray(value);
    }

    public isLastItem(item: any): boolean {
        if (!this.valueText || !Array.isArray(this.valueText)) {
            return false;
        }
        return this.valueText.indexOf(item) === this.valueText.length - 1;
    }

    protected readonly text = text;
    protected readonly toolbar = toolbar;
    protected readonly InputType = InputType;
}
