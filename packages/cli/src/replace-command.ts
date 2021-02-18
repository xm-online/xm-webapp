import * as fs from 'fs';
import { Command } from './command';

export type ReplaceCommandParams = '--theme' | '--styles' | '--webmanifest' | '--app-module' | '--index';

export class ReplaceCommand implements Command {

    public targetTheme: string = 'src/styles/_theme.scss';
    public targetStyles: string = 'src/styles.scss';
    public targetWebmanifest: string = 'src/manifest.webmanifest';
    public targetAppModule: string = 'src/app/xm.module.ts';
    public targetIndexHtml: string = 'src/index.html';

    public replaceFile(sourcePath: string, targetPath: string): void {
        const source = fs.readFileSync(sourcePath);
        fs.writeFileSync(targetPath, source);
    }

    public execute(terminalArgs?: string[]): void {
        if (!terminalArgs || !terminalArgs.length) {
            console.warn('No arguments provided');
            return;
        }
        for (let i = 0; i < terminalArgs.length; i += 2) {
            const command = terminalArgs[i];
            const value = terminalArgs[i + 1];
            this.replace(command, value);
        }
    }

    public replace(command: ReplaceCommandParams | string, value: string): void {
        switch (command) {
            case '--theme':
                this.replaceFile(value, this.targetTheme);
                console.info(`_theme.scss is replaced with ${value}.`);
                break;
            case '--styles':
                this.replaceFile(value, this.targetStyles);
                console.info(`styles.scss is replaced with ${value}.`);
                break;
            case '--webmanifest':
                this.replaceFile(value, this.targetWebmanifest);
                console.info(`manifest.webmanifest is replaced with ${value}.`);
                break;
            case '--app-module':
                this.replaceFile(value, this.targetAppModule);
                console.info(`xm.module.ts is replaced with ${value}.`);
                break;
            case '--index':
                this.replaceFile(value, this.targetIndexHtml);
                console.info(`index.html is replaced with ${value}.`);
                break;
            default:
                console.warn(`The unknown params: ${command}`);
        }
    }

}
