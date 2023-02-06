import { saveAs } from 'file-saver';

/**
 * Saves a file by opening file-save-as dialog in the browser
 * using file-save library.
 * @param blobContent - file content as a Blob
 * @param fileName - name file should be saved as
 * @param responseType - response type
 */
export const saveFile = (blobContent: Blob, fileName: string, responseType: string): void => {
    const blob = new Blob([blobContent], {type: responseType ? responseType : 'application/octet-stream'});
    saveAs(blob, fileName);
};

/**
 * Saves a file by opening file-save-as dialog in the browser
 * using file-save library.
 * @param url - path
 * @param fileName - name file should be saved as
 */
export const saveFileFromUrl = (url: string, fileName: string): void => {
    saveAs(url, fileName);
};

/**
 * Derives file name from the http response
 * by looking inside content-disposition
 * @param res - http Response
 */
export const getFileNameFromResponseContentDisposition = (res: any): any => {
    const contentDisposition = res.headers.get('content-disposition') || '';
    if (!contentDisposition) {
        return '"untitled"';
    }
    const matches = (/filename=([^;]+)/ig).exec(contentDisposition);
    return (matches[1] || 'untitled').trim();
};

/**
 * Saves a CSV file
 * using file-save library.
 * @param blobContent - file content as a Blob
 * @param fileName - name file should be saved as
 */
export const saveCSVFile = (blobContent: Blob, fileName: string): void => {
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), blobContent], {type: 'text/csv;charset=UTF-8'});
    saveAs(blob, fileName);
};
