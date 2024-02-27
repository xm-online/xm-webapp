import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
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
    public translationForm: FormGroup<{
        key: FormControl<string|null>,
        value: FormControl<string|null>}>;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<TranslationModalComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: TranslateAdd,
    ) {
    }

    public ngOnInit(): void {
        this.translationForm = this.fb.group({
            key: '',
            value: '',
        });
    }
}

interface TranslateAdd {
    langs: string[];
}
