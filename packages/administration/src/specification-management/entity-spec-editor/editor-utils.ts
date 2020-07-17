type MultiLanguageDataModel = {
    languageKey: string;
    name: string;
}[];

export class EditorUtils {

    public toMultiLanguageDataModel(name: any): MultiLanguageDataModel {
        return name ? Object.keys(name).map((k) => ({languageKey: k, name: name[k]})) : null;
    }

    public fromMultiLanguageDataModel(name: any, value: MultiLanguageDataModel): void {
        value.forEach((i) => {
            name[i.languageKey] = i.name;
        });
    }
}
