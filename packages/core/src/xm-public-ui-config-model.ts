// TODO: sync with widget
interface IWidget<C = any, S = any> {
    selector: string;
    module?: string;
    config?: C;
}

interface ILayout {
    class?: string;
    content?: ILayout[];
    widget?: IWidget;
}

export interface UIPublicConfig {
    logoUrl?: string;
    name?: string;
    iconsInMenu?: string | boolean;
    theme?: string;
    favicon?: string;
    loginScreenBgn?: string;
    googleApiKey?: string;
    langs?: string[];
    fullWidth?: boolean;
    defaultDashboard?: number | string;
    datesFormats?: {
        en?: string;
        ru?: string;
    };
    socialConfiguration?: {
        linkedinEnabled?: boolean;
        facebookEnabled?: boolean;
        googleEnabled?: boolean;
        twitterEnabled?: boolean;
    };
    notifications?: {
        resourceUrl?: string;
        redirectUrl?: string;
        labelPath?: string;
        initialState?: string;
        changeStateName?: string;
        showAsHtml?: boolean;
        showDate?: boolean;
        max?: number;
        autoUpdate?: number;
        autoUpdateEnabled?: boolean;
    };
    social?: {
        providerId?: string;
        scope?: string;
        icon?: { style?: string; class?: string };
    }[];
    search?: {
        fullMatch?: boolean;
        searchPanel?: boolean;
    };
    defaultLayout?: ILayout[];
    idp?: {
        enabled?: boolean;
    },
    ribbon?: boolean;
    showVersion?: boolean;
}
