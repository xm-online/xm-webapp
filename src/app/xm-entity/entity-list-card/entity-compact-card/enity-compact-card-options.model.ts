export class EntityCompactCardOptions {
    constructor(public showTitle?: string,
                public showState?: boolean,
                public showAvatar?: boolean,
                public fields?: CardFieldOptions[],
                ) {}
}

export class CardFieldOptions {
    constructor(public field?: string,
                public title?: any) {}
}
