import { Translate } from '@xm-ngx/translation';

export type XmTableWarningMessageParams = Record<string, unknown>;

/**
 * State emitted by the controller method.
 * `params` are interpolated into the title, e.g. `"Only {{limit}} records are shown"`.
 * `title` overrides the configured title when provided.
 */
export interface XmTableWarningMessageState {
    show: boolean;
    params?: XmTableWarningMessageParams;
    title?: Translate;
}

/** Controller method result: plain `boolean` (legacy) or {@link XmTableWarningMessageState}. */
export type XmTableWarningMessageControllerResult = boolean | XmTableWarningMessageState;

export interface XmTableWarningMessageConfig {
    controller: {
        key: string;
        method: string;
    };
    title?: Translate;
    /** Static interpolation params, merged with (and overridden by) params from the controller. */
    params?: XmTableWarningMessageParams;
}
