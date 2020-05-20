import { Compiler, Inject, Injectable, NgModuleFactory, NgModuleRef, Optional, Type } from '@angular/core';
import { DYNAMIC_COMPONENTS } from '@xm-ngx/components/dynamic/dynamic.injectors';
import { DynamicComponents } from '@xm-ngx/components/dynamic/dynamic.module';
import * as _ from 'lodash';
import { DynamicComponentsBase, IDynamicComponent, IDynamicModule } from './dynamic-components-base';

@Injectable()
export class DynamicComponentsService extends DynamicComponentsBase {

    private elementsLoading: Map<string, Promise<Type<unknown>>> = new Map<string, Promise<Type<unknown>>>();

    constructor(private moduleRef: NgModuleRef<unknown>,
                @Optional() private compiler: Compiler,
                @Inject(DYNAMIC_COMPONENTS) protected dynamics: DynamicComponents[]) {
        super(_.keyBy(_.flatMap(dynamics), 'selector'));
    }

    public async load<T>(selector: string): Promise<Type<T>> {
        const tR = this.resolve<T>(selector);
        if (tR) {
            return tR;
        }

        if (this.elementsLoading.has(selector)) {
            return await this.elementsLoading.get(selector) as Type<T>;
        }

        const dynamicElement = this.getSync(selector);
        const loadedElement = this.getLazyComponent<T>(dynamicElement);
        this.elementsLoading.set(selector, loadedElement);

        return await loadedElement;
    }

    private async getLazyComponent<T>(lazy: IDynamicComponent): Promise<Type<T>> {
        type CNgModuleFactory = NgModuleFactory<IDynamicModule<T>>;

        if (!lazy.loadChildren) {
            throw new Error(`The "${lazy.selector}" is not lazy component!`);
        }

        const elementModuleOrFactory = await lazy.loadChildren();
        let elmoduleFactory: CNgModuleFactory;
        if (elementModuleOrFactory instanceof NgModuleFactory) {
            elmoduleFactory = elementModuleOrFactory as CNgModuleFactory;
        } else {
            elmoduleFactory = await this.compiler.compileModuleAsync(elementModuleOrFactory) as CNgModuleFactory;
        }

        const elementModuleRef = elmoduleFactory.create(this.moduleRef.injector);
        if (!elementModuleRef.instance.entry || elementModuleRef.instance.resolve) {
            throw new Error(`ERROR: the "${elmoduleFactory.moduleType}" module expected to have `
                + 'a "entry" field or "resolve" method!'
                + 'E.g. class MyClass{ entry = YourComponent; }');
        }

        return elementModuleRef.instance.entry || await elementModuleRef.instance.resolve(lazy.selector);
    }
}
