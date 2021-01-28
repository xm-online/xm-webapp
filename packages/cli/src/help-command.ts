import { CliCommands, Command } from './command';

export class HelpCommand implements Command {

    public commands: { name: CliCommands, message: string }[] = [
        { name: 'doc', message: 'Generates a documentation.' },
        { name: 'replace', message: 'Replaces the core files.' },
        { name: 'ext-lazy-module', message: 'Places extension modules in angular.json.' },
        { name: 'ext-i18n', message: 'Combines extension translations into one file.' },
        { name: 'ext-assets', message: 'Places extension assets in angular.json.' },
        { name: 'ext-themes', message: 'Builds extension themes.' },
        { name: 'ext-install', message: 'Runs `npm install` at extension directories.' },
        { name: 'ext-routing', message: 'Combines extension routing.ts in the routing.ts.' },
        { name: 'ext-theming', message: 'Combines extension theming.scss in the theming.scss.' },
        { name: 'help', message: 'Lists available commands and their short descriptions.' },
    ];

    public execute(): void {
        console.info('Available Commands:');

        for (const command of this.commands) {
            console.info('  \x1b[36m%s\x1b[0m', command.name, command.message);
        }
    }

}
