export function download(data: string, filename: string, type: string): void {
    const file = new Blob([data], {type});
    // @ts-ignore
    if (window.navigator.msSaveOrOpenBlob) { // IE10+
        // @ts-ignore
        window.navigator.msSaveOrOpenBlob(file, filename);
    } else { // Others
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            // @ts-ignore
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
