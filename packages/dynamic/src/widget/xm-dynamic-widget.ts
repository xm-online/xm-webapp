/**
 * Use this interface when you need to create a dynamic widget
 * @public
 */
export interface XmDynamicWidget {
    /**
     * Widget configuration
     */
    config: unknown | null;

    /** @deprecated spec will be removed, you should provide the spec locally */
    spec?: unknown;
    readme?: {
        default?: string;
    };
}
