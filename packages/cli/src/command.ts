export interface Command {
    execute<T>(args: T): void;
    execute(args: unknown): void;
    execute(): void;
}

export type CliCommands = 'ext-assets'
    | 'help'
    | 'ext-i18n'
    | 'ext-install'
    | 'ext-lazy-module'
    | 'replace'
    | 'doc'
    | 'ext-routing'
    | 'ext-theming'
    | 'ext-themes';
