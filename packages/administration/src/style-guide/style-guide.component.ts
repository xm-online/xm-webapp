import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'xm-style-guide',
    templateUrl: './style-guide.component.html',
    styleUrls: ['./style-guide.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StyleGuideComponent implements OnInit {

    public colors: string[] = ['primary', 'secondary', 'warning', 'danger', 'success', 'surface'];
    public fonts: string[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'subheader', 'caption'];

    public group: UntypedFormGroup = new UntypedFormGroup({
        default: new UntypedFormControl(''),
        email: new UntypedFormControl('<email>@email.ccom', [Validators.required, Validators.email]),
    });

    public getStyles(el: Element, property: keyof CSSStyleDeclaration | string): string {
        const style = window.getComputedStyle(el, null);
        return style.getPropertyValue(property as string);
    }

    public ngOnInit(): void {
        this.group.markAllAsTouched();
    }
}
