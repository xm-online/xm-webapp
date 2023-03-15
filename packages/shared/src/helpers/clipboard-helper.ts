export function copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } 

    return new Promise((resolve, reject) => {
        try {
            window.prompt('Copy to clipboard: Ctrl+C, Enter', text);

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function readFromClipboard(): Promise<string> {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.readText();
    } 

    return new Promise((resolve, reject) => {
        try {
            const data = window.prompt('Paste from clipboard: Ctrl+V, Enter', '');

            if (data == null) {
                reject(new Error('The user clicked the cancel button'));
            }

            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}