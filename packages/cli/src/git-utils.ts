import { exec } from 'child_process';

export function ignoreChangedFile(path: string): void {
    exec(`git update-index --assume-unchanged ${path}`);
}
