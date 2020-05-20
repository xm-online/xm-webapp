import { NgModuleFactory, Type } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IDynamicModule<T> {
    entry?: Type<T>;
    resolve?: (key: string) => Promise<Type<T>>;
}
export type CNgModuleFactory<T = any> = NgModuleFactory<IDynamicModule<T>>;


export interface IDynamicComponent<T = unknown> {
    selector?: string;
    componentRef?: Type<T>;
    loadChildren?: () => Promise<CNgModuleFactory<T>>;
}

interface IDynamicComponentMap {
    [selector: string]: IDynamicComponent;
}

export class DynamicComponentsBase {
    public readonly components$: Observable<IDynamicComponentMap>;
    protected components: BehaviorSubject<IDynamicComponentMap>;

    constructor(componentsMap: IDynamicComponentMap = {}) {
        this.components = new BehaviorSubject(componentsMap);
        this.components$ = this.components.asObservable();
    }

    public get(selector: string): Observable<IDynamicComponent | undefined> {
        return this.components$.pipe(
            map((i) => i[selector]),
        );
    }

    public getSync<T>(selector: string): IDynamicComponent<T> | undefined {
        const all = this.components.getValue();
        return all[selector] as IDynamicComponent<T>;
    }

    public add(component: IDynamicComponent): boolean {
        if (!component) {
            throw new Error('Component is undefined!');
        }

        const all = this.components.getValue();

        if (all[component.selector]) {
            throw new Error(`${all[component.selector]} is already exist!`);
        }

        all[component.selector] = component;
        this.components.next(all);
        return true;
    }

    public addAll(components: IDynamicComponent[]): boolean {
        if (!components) {
            throw new Error('Components is undefined!');
        }

        const all = this.components.getValue();

        components.forEach((component) => {
            if (all[component.selector]) {
                throw new Error(`${all[component.selector]} is already exist!`);
            }

            all[component.selector] = component;
        });

        this.components.next(all);
        return true;
    }

    public resolve<T>(selector: Type<T> | string): Type<T> {
        if (typeof selector === 'string') {
            const item = this.getSync<T>(selector);
            return item ? item.componentRef : undefined;
        }
        return selector;
    }
}
