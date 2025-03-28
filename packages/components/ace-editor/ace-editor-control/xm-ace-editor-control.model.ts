export interface XmAceEditorControlOptions {
    id?: string;
    title?: string;
    name?: string;
    mode: XmAceEditorControlModeEnum;
    type: XmAceEditorControlTypeEnum;
    height?: string;
    theme?: string;
    darkTheme?: string;
    enableInitialFocus?: boolean;
    options?: XmAceEditorControlOptionsConfig;
}

export interface XmAceEditorControlOptionsConfig {
    highlightActiveLine?: boolean;
    maxLines?: number;
    tabSize?: number;
    printMargin?: boolean;
    autoScrollEditorIntoView?: boolean;
    useWrapMode?: boolean;
}

export enum XmAceEditorControlModeEnum {
    JSON = 'json',
    YAML = 'yaml',
    JAVASCRIPT = 'javascript',
    SQL = 'sql',
}

export enum XmAceEditorControlTypeEnum {
    OBJECT = 'object',
    STRING = 'string'
}
