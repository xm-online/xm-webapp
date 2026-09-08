export interface EditWidgetButtonsConfig {
    permissions: string[];
    /**
     * Unique identifier for this edit button instance.
     * Used to prevent other forms on the page from entering edit mode.
     */
    instanceId?: string;
}
