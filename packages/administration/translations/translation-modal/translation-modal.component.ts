import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MultiLanguageComponent } from '@xm-ngx/components/multilanguage';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
    selector: 'xm-translation-modal',
    standalone: true,
    imports: [CommonModule, MatDialogTitle, MatDialogContent,
        ReactiveFormsModule, MatFormFieldModule, MatInputModule,
        MatSelectModule, MatDialogActions, MatDialogClose,
        MatButtonModule, MultiLanguageComponent, MatButtonToggleModule],
    templateUrl: './translation-modal.component.html',
    styleUrl: './translation-modal.component.scss',
})
export class TranslationModalComponent implements OnInit {
    public translationForm: FormGroup;

    public languages = [
        {name: 'English', code: 'en'},
        {name: 'Spanish', code: 'es'},
        // Add more languages as needed
    ];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<TranslationModalComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: TranslataAdd,
        // private translationService: TranslationService // Inject the translation service
    ) {
    }

    public ngOnInit(): void {
        this.translationForm = this.fb.group({
            key: '',
            value: '',
        });
    }

    public addTranslation(): void {
        if (this.translationForm.valid) {
            //this.translationService.addTranslation(this.translationForm.value);
            this.dialogRef.close();
        }
    }

    public setValue(event: any): void {
        event;
    }

    public setLang(lang: any): void {
        lang;
    }
}

interface TranslataAdd {
    langs: string[],
}
