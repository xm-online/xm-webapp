export class EntityLifecycleWidgetOptions {
    constructor(public title: string,
                public entity: string,
                public statuses: LifecycleItem[],
                public circle: boolean,
                public subscribeEventName: string) {

    }
}

export class LifecycleItem {
    constructor(public name: string,
                public color: string,
                public icon: string,
                public stateKeys: string[],
                public final: boolean) {}
}
