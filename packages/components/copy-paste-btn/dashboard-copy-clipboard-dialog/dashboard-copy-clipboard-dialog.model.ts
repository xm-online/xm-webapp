import { Translate } from '@xm-ngx/translation';

export enum ClipboardOperations {
    COPY = 'COPY',
    PASTE = 'PASTE',
}

export interface DialogCopyConfig {
    title?: Translate;
    copyButtonText?: Translate;
    pasteButtonText?: Translate;
    downloadButtonText?: Translate;
    uploadButtonText?: Translate;
    closeText?: Translate;
    saveText?: Translate;
    dateFormat?: string;
}

export interface DashboardCopyClipboardDialog {
    value: string;
    operation: ClipboardOperations;
}

export const DEFAULT_CONFIG = {
    title: {
        uk: 'Оберіть дію',
        en: 'Choose action',
    },
    copyButtonText: {
        uk: 'Копіювати',
        en: 'Copy',
    },
    pasteButtonText: {
        uk: 'Втавити',
        en: 'Paste',
    },
    downloadButtonText: {
        uk: 'Завантажити у файл',
        en: 'Download',
    },
    uploadButtonText: {
        uk: 'Завантажити з файлу',
        en: 'Upload',
    },
    closeText: {
        uk: 'Закрити',
        en: 'Close',
    },
    saveText: {
        uk: 'Зберегти',
        en: 'Save',
    },
    dateFormat: 'YYYY-MM-DD_HH-mm'
};
