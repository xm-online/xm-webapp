import { FileTypeResult,fromBuffer } from 'file-type/core';

export interface FileTypeFallbackType {
    ext: string;
    mime: string;
}

/**
 * Requirements
 * 1. NPM "file-type" v.16.5.3
 * 2. Add this to polyfills.ts
 * ----
 * (window as any).global = window;
 * (window as any).Buffer = (window as any).Buffer || require('buffer').Buffer;
 * ----
 *
 * DON'T USE IT UNLESS ABSOLUTELY NECESSARY
 * */
export class FileTypeFallback {
    private static async getTrueFileType(file: File): Promise<FileTypeResult | undefined> {
        return file.arrayBuffer().then(buffer => fromBuffer(buffer));
    }

    public static async getFileType(file: File): Promise<FileTypeFallbackType | null> {
        let fileType: FileTypeFallbackType | null = null;

        try {
            fileType = await FileTypeFallback.getTrueFileType(file);
        } catch (e) {
            console.info('Unrecognizable file type');
        }

        return fileType;
    }
}
