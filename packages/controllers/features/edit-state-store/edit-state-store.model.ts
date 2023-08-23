export enum EDIT_STATE {
    EDIT = 'edit',
    VIEW = 'view',
}

export enum EDIT_EVENT {
    SAVE = 'SAVE',
    CANCEL = 'CANCEL',
}

export enum EDIT_ACTION {
    EDIT = 'edit',
    SAVE = 'save',
    CANCEL = 'cancel',
}

export type EditDisableState = Record<EDIT_ACTION, boolean>
