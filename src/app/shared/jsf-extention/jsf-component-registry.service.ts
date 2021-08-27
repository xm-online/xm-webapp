import { Injectable } from '@angular/core';
import { buildJsfAttributes, getJsfWidgets } from '.';

@Injectable({
  providedIn: 'root'
})
export class JsfComponentRegistryService {

  private componentList: any = {};

  constructor() { 
    this.componentList = getJsfWidgets();
  }

  public registerWidget(name: string, componentClass: Object) {
    if (this.componentList[name]) {
      throw new Error(`Widget ${name} has been already registered!`);
    }
    this.componentList[name] = componentClass;
  }
  
  public listWidgets() {
    return this.componentList;
  }

  public buildJsfAttributes(spec: any, form: any) {
    return buildJsfAttributes(spec, form, this.componentList);
  }
}
