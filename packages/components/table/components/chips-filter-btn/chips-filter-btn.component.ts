import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Translate, XmTranslatePipe } from '@xm-ngx/translation';
import { MatMenuModule, MatMenuPanel } from '@angular/material/menu';
import { InputType } from './chips-filter-btn.model';


@Component({
    selector: 'xm-chips-filter-btn',
    standalone: true,
    imports: [
        CommonModule,
        MatChipsModule,
        MatIconModule,
        MatMenuModule,
        XmTranslatePipe
    ],
    templateUrl: './chips-filter-btn.component.html',
    styleUrl: './chips-filter-btn.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsFilterBtnComponent {
    @Input() public title: string;
    @Input() public value: any;
    @Input() public customIcon: string;
    @Input() public valueText: string | Translate;
    @Input() public menu: MatMenuPanel = null;
    @Input() public arrow: boolean = false;
    @Input() public disabled: boolean = false;
    @Input() public inputField: any = null;
    @Input() public type: InputType = InputType.Input;
    @Input() public textWidth: string = '120px';
    @Output() public valueCleared: EventEmitter<void> = new EventEmitter<void>();
    @Output() public valueToggle: EventEmitter<void> = new EventEmitter<void>();
    public isChecked: boolean = false;
    protected readonly InputType = InputType;

    public clickAction(): void {
        switch (this.type) {
            case InputType.Toggle:
                this.isChecked = !this.isChecked;
                this.valueToggle.emit();
                this.value = this.valueText;
                break;
            case InputType.Calendar:
                this.valueToggle.emit();
                this.value = this.valueText;
                break;
            default:
                this.inputField?.nativeElement?.focus();
                break;
        }
    }

    public clear(event: Event): void {
        event.stopPropagation();
        this.isChecked = false;
        this.value = null;
        this.valueCleared.emit();
    }

    public closeMenu(): void {
        this.menu?.close?.emit();
    }

    public isArray<T>(value: T): boolean {
        return Array.isArray(value);
    }

}
