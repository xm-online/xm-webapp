import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IFeedbackRequest } from '../feedback.service';

const TRANSLATES = {
    feedback: { en: 'Feedback', ru: 'Обратная связь', uk: 'Відгуки' },
    title: { en: 'Topic', ru: 'Тема', uk: 'Тема' },
    send: { en: 'Send', ru: 'Отправить', uk: 'Надіслати' },
    image: { en: 'Image', ru: 'Изображение', uk: 'Зображення' },
    cancel: { en: 'Cancel', ru: 'Отмена', uk: 'Скасувати' },
    description: { en: 'Description', ru: 'Описание', uk: 'Опис' },
    feedbackDetails: {
        en: 'Send your review - we are sure it will make our product better!',
        ru: 'Отправь свой отзыв - уверены, он сделает наш продукт лучше!',
        uk: 'Відправ свій відгук - впевнені, він зробить наш продукт краще!',
    },
    attachImage: {
        en: 'Include image',
        ru: 'Прикрепить изображение',
        uk: 'Прикріпити зображення',
    },
};

@Component({
    selector: 'xm-feedback-dialog',
    templateUrl: './feedback-dialog.component.html',
    styleUrls: ['./feedback-dialog.component.scss'],
})
export class FeedbackDialogComponent {

    public TRS: typeof TRANSLATES = TRANSLATES;

    public defaultTitle: string = 'FEEDBACK: ' + new Date().toISOString();
    public attachImage: boolean = true;

    constructor(
        public dialogRef: MatDialogRef<FeedbackDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: IFeedbackRequest,
    ) {
        if (!data) {
            this.data = {
                image: '',
                version: '',
                message: '',
                topic: '',
            };
        }
    }

    public submit(): void {
        const result: IFeedbackRequest = {
            topic: this.data.topic || this.defaultTitle,
            message: this.data.message,
            version: this.data.version,
            image: this.attachImage ? this.data.image : '',
        };

        this.dialogRef.close(result);
    }

}
