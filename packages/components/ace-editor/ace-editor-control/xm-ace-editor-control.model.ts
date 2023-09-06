export interface XmAceEditorControlOptions {
    id?: string;
    title?: string;
    name?: string;
    mode: string | XmAceEditorControlModeEnum;
    height?: string;
    theme?: string;
    darkTheme?: string;
    enableInitialFocus?: boolean;
    options?: {
        highlightActiveLine?: boolean;
        maxLines?: number;
        tabSize?: number;
        printMargin?: boolean;
        autoScrollEditorIntoView?: boolean;
    },
}

export enum XmAceEditorControlModeEnum {
    OBJECT_TO_JSON = 'object-to-json',
    OBJECT_TO_YAML = 'object-to-yaml',
    JSON = 'json',
    YAML = 'yaml'
}
