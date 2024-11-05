import { Injectable } from '@angular/core';
import { buildJsfAttributes, getJsfWidgets } from './jsf-attributes-helper';

@Injectable({
    providedIn: 'root',
})
export class JsfComponentRegistryService {

    private componentList: { [key: string]: object } = {};

    constructor() {
        this.componentList = getJsfWidgets();
    }

    public registerWidget(name: string, componentClass: object): void {
        if (this.componentList[name]) {
            throw new Error(`Widget ${name} has been already registered!`);
        }
        this.componentList[name] = componentClass;
    }

    public listWidgets(): { [key: string]: object } {
        return this.componentList;
    }

    public buildJsfAttributes(spec: any, form: any): any {
        return buildJsfAttributes(spec, form, this.componentList);
    }
}
