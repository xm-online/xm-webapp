export interface SelectDeepLinkOptions {
    iconName: string;
    iconColor: string;
    privileges: string[];
}

export interface ExtSelectOptions {
    placeholder?: string;
    title?: string;
    url?: string;
    description?: string;
    sourceField?: string;
    arrayField?: string;
    labelField?: string;
    valueField?: string;
    relatedFields?: any[];
    translations?: any;
    htmlClass?: any;
    required?: boolean;
    emptyPlaceholder?: string;
    link?: SelectDeepLinkOptions;
}
