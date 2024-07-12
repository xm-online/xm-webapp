export function copyToClipboard(text: string, options: { insecurePrompt: boolean } = {insecurePrompt: true}): Promise<void> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
    } catch (error) {
        console.warn(error);
    }

    return new Promise((resolve, reject) => {
        try {
            if (options.insecurePrompt) {
                window.prompt('Copy to clipboard: Ctrl+C, Enter', text);
            }

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function readFromClipboard(): Promise<unknown> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.readText();
        }
    } catch (error) {
        console.warn(error);
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
