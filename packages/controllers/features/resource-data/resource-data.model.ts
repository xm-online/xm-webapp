export enum EDIT_STATE {
    EDIT = 'edit',
    VIEW = 'view'
}
 export interface DataResourceOptions{
    updateIfEntityChange?: boolean,
    updateEntityChangeParams?: string[],
    updateDelay?: number
}
